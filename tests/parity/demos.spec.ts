import {expect, test, type Locator, type Page} from '@playwright/test';

// Interactive demo tests (plan 7.1). One test per demo, run against both sites:
//   npx playwright test demos.spec.ts --project=old
//   npx playwright test demos.spec.ts --project=new
//
// Each demo test checks, in order:
//   1. the editor loads and the demo reacts to typing (or a click)
//   2. there are no console errors
//   3. it still works after leaving the page and coming back through the
//      client router (a window marker proves it was a soft navigation)
//   4. the editor follows theme changes
//
// ANTLR's default error listener logs "token recognition error" to the console
// when a lone "/" is typed. The old site does the same, so that one is allowed.

const isNew = () => test.info().project.name === 'new';
const THEME_HOST = () => (isNew() ? 'html' : 'body');
const TOLERATED = /token recognition error/;

type Marked = {__marker?: boolean};

/** Collects console errors and uncaught page errors. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !TOLERATED.test(msg.text())) {
      errors.push(`console: ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  // The counter demo calls alert() when it wraps around.
  page.on('dialog', (dialog) => void dialog.dismiss());
  return errors;
}

/** Waits until every island on the page has hydrated (the old site has none). */
async function hydrated(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(
    () => document.querySelector('astro-island[ssr]') == null,
  );
}

async function openPost(page: Page, slug: string) {
  await page.goto(`/blog/${slug}/`);
  await hydrated(page);
}

/** Click at the end of the document so typing appends to it. */
async function typeAtEnd(editor: Locator, text: string) {
  const page = editor.page();
  await editor.locator('.cm-content').click();
  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.type(text);
}

async function pickTheme(page: Page, choice: 'light' | 'dark') {
  await page.getByRole('button', {name: 'Change Theme'}).click();
  await page
    .getByRole('menuitem', {name: `Change theme to ${choice} mode`})
    .click();
}

type Demo = {
  /** Post slug. */
  slug: string;
  /** Selector for the element that holds the editor (or the whole demo). */
  root: (page: Page) => Locator;
  /** Interacts with the demo and asserts that it reacted. */
  exercise: (page: Page) => Promise<void>;
  /** Whether the demo contains a CodeMirror editor (for the theme check). */
  editor?: (page: Page) => Locator;
};

function runDemo(name: string, demo: Demo) {
  test(name, async ({page}) => {
    await page.emulateMedia({colorScheme: 'light'});
    const errors = watchErrors(page);

    await test.step('loads and reacts', async () => {
      await openPost(page, demo.slug);
      await demo.root(page).scrollIntoViewIfNeeded();
      await demo.exercise(page);
    });

    await test.step('survives client-side navigation', async () => {
      await page.evaluate(() => {
        (window as unknown as Marked).__marker = true;
      });
      await page.getByRole('link', {name: 'Blog', exact: true}).click();
      await expect(page).toHaveURL(/\/blog\/$/);
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`/${demo.slug}/$`));
      expect(
        await page.evaluate(() => (window as unknown as Marked).__marker),
        'navigation should be a soft swap, not a reload',
      ).toBe(true);
      await hydrated(page);
      await demo.root(page).scrollIntoViewIfNeeded();
      await demo.exercise(page);
    });

    if (demo.editor) {
      await test.step('follows theme changes', async () => {
        const editor = demo.editor!(page);
        const wrapper = editor.locator('xpath=..');
        await expect(wrapper).toHaveClass(/cm-theme-light/);
        const lightBg = await editor.evaluate(
          (el) => getComputedStyle(el).backgroundColor,
        );

        await pickTheme(page, 'dark');
        await expect(page.locator(THEME_HOST())).toHaveClass(/\bdark\b/);
        await expect(wrapper).toHaveClass(/cm-theme-dark/);
        await expect
          .poll(() =>
            editor.evaluate((el) => getComputedStyle(el).backgroundColor),
          )
          .not.toBe(lightBg);

        await pickTheme(page, 'light');
        await expect(wrapper).toHaveClass(/cm-theme-light/);
      });
    }

    expect(errors, 'console and page errors').toEqual([]);
  });
}

const editorAt = (n: number) => (page: Page) =>
  page.locator('.CodeEditor').nth(n).locator('.cm-editor');
const rootAt = (n: number) => (page: Page) =>
  page.locator('.CodeEditor').nth(n);

test.describe('Demos', () => {
  test.describe('learning-codemirror', () => {
    runDemo('FacetExample: panel from a facet, focus logger', {
      slug: 'learning-codemirror',
      root: rootAt(0),
      editor: editorAt(0),
      async exercise(page) {
        const editor = editorAt(0)(page);
        await expect(editor.locator('.cm-panels')).toContainText(
          'This editor is named: My Cool Editor.',
        );
        const logs: string[] = [];
        const onLog = (msg: {text(): string}) => logs.push(msg.text());
        page.on('console', onLog);
        await editor.locator('.cm-content').click();
        await expect
          .poll(() => logs.join('\n'))
          .toContain('The user is focusing on the editor');
        page.off('console', onLog);
        await typeAtEnd(editor, 'x');
        await expect(editor.locator('.cm-content')).toContainText('x');
      },
    });

    runDemo('StateFieldExample: counter panel counts edits', {
      slug: 'learning-codemirror',
      root: rootAt(1),
      editor: editorAt(1),
      async exercise(page) {
        const editor = editorAt(1)(page);
        const panel = editor.locator('.cm-panels');
        const read = async () =>
          Number(/(\d+)/.exec(await panel.innerText())![1]);
        await expect(panel).toContainText('Current count is');
        const before = await read();
        await typeAtEnd(editor, 'abc');
        await expect.poll(read).toBe(before + 3);
      },
    });

    runDemo('MarkDecorationExample: midpoint widget follows the document', {
      slug: 'learning-codemirror',
      root: rootAt(2),
      editor: editorAt(2),
      async exercise(page) {
        const editor = editorAt(2)(page);
        const widget = editor.locator('.cm-content span.bg-green-500');
        await expect(widget).toHaveCount(1);
        const read = async () => Number(await widget.innerText());
        const before = await read();
        await typeAtEnd(editor, 'abcdefgh');
        await expect.poll(read).toBe(before + 4);
      },
    });

    runDemo('ViewPluginExample: midpoint shows only while focused', {
      slug: 'learning-codemirror',
      root: rootAt(3),
      editor: editorAt(3),
      async exercise(page) {
        const editor = editorAt(3)(page);
        const widget = editor.locator(':scope > div.bg-green-500');
        await expect(widget).toHaveCount(1);
        await expect(widget).toBeHidden();
        const read = async () => Number(await widget.innerText());
        await editor.locator('.cm-content').click();
        await expect(widget).toBeVisible();
        const before = await read();
        await page.keyboard.press('ControlOrMeta+End');
        await page.keyboard.type('abcdefgh');
        await expect.poll(read).toBe(before + 4);
        await page.locator('h1').first().click();
        await expect(widget).toBeHidden();
      },
    });
  });

  test.describe('codemirror-and-react', () => {
    runDemo('ButtonExample: React counter', {
      slug: 'codemirror-and-react',
      root: (page) => page.getByRole('button', {name: 'Increase Counter'}),
      async exercise(page) {
        const count = page.locator('p:has-text("Count:") span.font-mono');
        const read = async () => Number(await count.first().innerText());
        const before = await read();
        await page
          .getByRole('button', {name: 'Increase Counter', exact: true})
          .click();
        // The counter wraps from 10 to 0 (with an alert), so compare modulo 11.
        await expect.poll(read).toBe((before + 1) % 11);
      },
    });

    runDemo('ReactCodeMirrorSyncStateExample: React and CodeMirror share state', {
      slug: 'codemirror-and-react',
      root: rootAt(0),
      editor: editorAt(0),
      async exercise(page) {
        const editor = editorAt(0)(page);
        const status = page.locator('span.font-mono.font-bold').last();
        const lint = editor.locator('.cm-lintRange');
        const text = async () => (await status.innerText()).replace(/\s+/g, ' ');

        // Count from wherever the demo is now: it may have been used already.
        const start = Number(/^(\d+)/.exec(await text())![1]);

        await expect(lint.first()).toBeVisible();

        // CodeMirror -> React
        await editor.locator('.cm-content').click();
        await page.keyboard.press('ControlOrMeta+End');
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await expect.poll(text).toBe(`${start + 2} / codemirror`);

        // React -> CodeMirror -> React
        await page
          .getByRole('button', {name: 'Increase count', exact: true})
          .click();
        await expect.poll(text).toBe(`${start + 3} / react`);

        // Deleting after a React update continues from the React value.
        await editor.locator('.cm-content').click();
        await page.keyboard.press('ControlOrMeta+End');
        await page.keyboard.press('Backspace');
        await expect.poll(text).toBe(`${start + 4} / codemirror`);

        // The lint toggle reconfigures the editor.
        const toggle = page.getByRole('button', {
          name: /^(Stop|Start) linting$/,
        });
        if ((await toggle.innerText()) === 'Start linting') {
          await toggle.click();
        }
        await expect(lint.first()).toBeVisible();
        await page.getByRole('button', {name: 'Stop linting'}).click();
        await expect(lint).toHaveCount(0);
        await page.getByRole('button', {name: 'Start linting'}).click();
        await expect(lint.first()).toBeVisible();
      },
    });
  });

  test.describe('advanced-state-management', () => {
    for (const [i, where] of [
      [0, 'first'],
      [1, 'last'],
    ] as const) {
      runDemo(`SQL terminal (${where} instance): lint, run button, status bar`, {
        slug: 'advanced-state-management-with-react-and-codemirror',
        root: rootAt(i),
        editor: editorAt(i),
        async exercise(page) {
          const terminal = page
            .locator('.BreakoutWithPadding')
            .filter({hasText: 'SQL Terminal 3000'})
            .nth(i);
          const editor = terminal.locator('.cm-editor');
          const run = terminal.getByRole('button', {name: 'run'});

          // The starting query has a wildcard. The linter waits 2.5s.
          await expect(terminal).toContainText(
            'Wildcard selectors are disallowed.',
            {timeout: 8_000},
          );
          await expect(run).toBeDisabled();
          await expect(editor.locator('.cm-lintRange-error')).toHaveCount(1);

          // Replace the query with a valid one.
          await editor.locator('.cm-content').click();
          await page.keyboard.press('ControlOrMeta+a');
          await page.keyboard.type('SELECT id FROM customers');
          await expect(terminal).toContainText('Waiting for input.', {
            timeout: 8_000,
          });
          await expect(run).toBeEnabled();

          await run.click();
          await expect(terminal).toContainText('Performing query...');
          await expect(terminal).toContainText('Query run in 1.8 seconds');

          // Put the wildcard back and run it with the keyboard shortcut.
          await editor.locator('.cm-content').click();
          await page.keyboard.press('ControlOrMeta+a');
          await page.keyboard.type('SELECT * FROM customers');
          await page.keyboard.press('Control+Enter');
          await expect(terminal).toContainText(
            'Wildcard selectors are disallowed.',
          );
          await expect(run).toBeDisabled();
        },
      });
    }
  });

  test.describe('antlr', () => {
    runDemo('CodeEditorWithTokens: Zephyr highlighting and token table', {
      slug: 'connecting-antlr-to-codemirror-6-building-a-language-server',
      root: rootAt(0),
      editor: editorAt(0),
      async exercise(page) {
        const editor = editorAt(0)(page);
        const spans = editor.locator('.cm-content .cm-line span[class]');
        const rows = page.locator('table tbody tr');

        await expect.poll(() => spans.count()).toBeGreaterThan(0);
        const classes = await spans.evaluateAll((els) => [
          ...new Set(els.map((e) => e.className)),
        ]);
        expect(classes.length, 'distinct highlight classes').toBeGreaterThan(1);

        const spansBefore = await spans.count();
        const rowsBefore = await rows.count();
        await typeAtEnd(editor, '\nlet answer = 42; // hi');
        await expect.poll(() => rows.count()).toBeGreaterThan(rowsBefore);
        await expect(page.locator('table tbody')).toContainText('answer');
        await expect(page.locator('table tbody')).toContainText(/let/i);
        await expect.poll(() => spans.count()).toBeGreaterThan(spansBefore);
      },
    });

    runDemo('CodeEditor (zephyr): language server drives highlighting', {
      slug: 'connecting-antlr-to-code-mirror-6-connecting-a-language-server',
      root: rootAt(0),
      editor: editorAt(0),
      async exercise(page) {
        const editor = editorAt(0)(page);
        const spans = editor.locator('.cm-content .cm-line span[class]');
        await expect.poll(() => spans.count()).toBeGreaterThan(0);
        const before = await spans.count();
        await typeAtEnd(editor, "\nlet answer = 42; // hi\nconst s = 'x';");
        await expect.poll(() => spans.count()).toBeGreaterThan(before);
        const classes = await spans.evaluateAll((els) => [
          ...new Set(els.map((e) => e.className)),
        ]);
        expect(classes.length, 'distinct highlight classes').toBeGreaterThan(1);
      },
    });
  });
});
