import {expect, test, type Page} from '@playwright/test';

// Theme tests (plan 4.2). Run against both sites:
//   old: the class lives on <body>, no flash protection is promised.
//   new: the class lives on <html>, set by an inline <head> script before paint.
//
// Both sites use real pages: /about/ (a page with the picker in the navbar) and
// a post with an open editor.
//   yarn build && yarn preview
//   npx playwright test theme.spec.ts --project=new

type Site = {
  /** A page with the theme picker in the navbar. */
  home: string;
  /** Link text that goes to a second page through the client router. */
  navLinkName: string;
  /** The path that link leads to. */
  navTarget: string;
  /** A page with an open editor. */
  editorPage: string;
  /** Selector for the element that carries the theme class. */
  host: string;
};

const SITES: Record<string, Site> = {
  new: {
    home: '/about/',
    navLinkName: 'Blog',
    navTarget: '/blog/',
    editorPage: '/blog/codemirror-and-react/',
    host: 'html',
  },
  old: {
    home: '/about/',
    navLinkName: 'Blog',
    navTarget: '/blog/',
    editorPage: '/blog/codemirror-and-react/',
    host: 'body',
  },
};

const site = (): Site => SITES[test.info().project.name];
const isNew = () => test.info().project.name === 'new';

async function hostClass(page: Page) {
  const host = site().host;
  return page.evaluate((sel) => document.querySelector(sel)!.className, host);
}

async function resolvedTheme(page: Page) {
  const cls = await hostClass(page);
  return cls.split(/\s+/).includes('dark') ? 'dark' : 'light';
}

async function pick(page: Page, choice: 'light' | 'dark' | 'system') {
  await page.getByRole('button', {name: 'Change Theme'}).click();
  const label =
    choice === 'system'
      ? 'Change theme to follow system setting'
      : `Change theme to ${choice} mode`;
  await page.getByRole('menuitem', {name: label}).click();
}

/** The picker is a React island; wait until it is hydrated and clickable. */
async function ready(page: Page) {
  await page.getByRole('button', {name: 'Change Theme'}).waitFor();
  // Radix opens on pointerdown, which only works after hydration.
  await page.waitForFunction(
    () =>
      document.querySelector('astro-island:not([ssr])') != null ||
      document.querySelector('#___gatsby') != null,
  );
}

async function open(page: Page, path: string) {
  await page.goto(path);
  await ready(page);
}

test.describe('Theme', () => {
  test('light, dark and system each apply', async ({page}) => {
    await page.emulateMedia({colorScheme: 'light'});
    await open(page, site().home);

    await pick(page, 'dark');
    expect(await resolvedTheme(page)).toBe('dark');

    await pick(page, 'light');
    expect(await resolvedTheme(page)).toBe('light');

    // system follows the emulated scheme, both ways
    await pick(page, 'system');
    expect(await resolvedTheme(page)).toBe('light');
    await page.emulateMedia({colorScheme: 'dark'});
    await expect.poll(() => resolvedTheme(page)).toBe('dark');
    await page.emulateMedia({colorScheme: 'light'});
    await expect.poll(() => resolvedTheme(page)).toBe('light');
  });

  test('system applies the OS scheme on load (dark and light)', async ({
    browser,
  }) => {
    const baseURL = test.info().project.use.baseURL;
    for (const scheme of ['dark', 'light'] as const) {
      const context = await browser.newContext({baseURL, colorScheme: scheme});
      const page = await context.newPage();
      await open(page, site().home);
      expect(await resolvedTheme(page)).toBe(scheme);
      await context.close();
    }
  });

  test('the dark class changes the page colors', async ({page}) => {
    await page.emulateMedia({colorScheme: 'light'});
    await open(page, site().home);
    const bg = () =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const light = await bg();
    await pick(page, 'dark');
    await expect.poll(bg).not.toBe(light);
  });

  for (const choice of ['light', 'dark'] as const) {
    test(`${choice} survives a reload`, async ({page}) => {
      // Pick the opposite of the OS scheme so the test cannot pass by accident.
      await page.emulateMedia({
        colorScheme: choice === 'dark' ? 'light' : 'dark',
      });
      await open(page, site().home);
      await pick(page, choice);
      await page.reload();
      await ready(page);
      expect(await resolvedTheme(page)).toBe(choice);
    });
  }

  test('system survives a reload', async ({page}) => {
    await page.emulateMedia({colorScheme: 'dark'});
    await open(page, site().home);
    await pick(page, 'light');
    await pick(page, 'system');
    await page.reload();
    await ready(page);
    expect(await resolvedTheme(page)).toBe('dark');
  });

  test('a saved choice from the old site format still works', async ({
    page,
  }) => {
    await page.emulateMedia({colorScheme: 'light'});
    await page.goto(site().home);
    await page.evaluate(() =>
      localStorage.setItem(
        'theme',
        JSON.stringify({theme: 'dark', followSystem: false}),
      ),
    );
    await page.reload();
    // Poll: the old site applies the class from React after load.
    await expect.poll(() => resolvedTheme(page)).toBe('dark');
  });

  for (const choice of ['light', 'dark'] as const) {
    test(`${choice} survives a client-side navigation`, async ({page}) => {
      await page.emulateMedia({
        colorScheme: choice === 'dark' ? 'light' : 'dark',
      });
      await open(page, site().home);
      await pick(page, choice);

      // A marker proves this is a router swap and not a full page load.
      await page.evaluate(() => {
        (window as unknown as {__marker: boolean}).__marker = true;
      });
      const from = new URL(page.url()).pathname;
      await page
        .getByRole('link', {name: site().navLinkName, exact: true})
        .click();
      await expect.poll(() => new URL(page.url()).pathname).not.toBe(from);
      expect(
        await page.evaluate(
          () => (window as unknown as {__marker?: boolean}).__marker,
        ),
      ).toBe(true);

      expect(await resolvedTheme(page)).toBe(choice);
      await ready(page);

      // And the picker on the new page still works.
      const other = choice === 'dark' ? 'light' : 'dark';
      await pick(page, other);
      expect(await resolvedTheme(page)).toBe(other);
    });
  }

  test('the new page never shows the wrong theme during a navigation', async ({
    page,
  }) => {
    test.skip(
      !isNew(),
      'Needs the before-swap handling; the old site has none.',
    );
    await page.emulateMedia({colorScheme: 'light'});
    await open(page, site().home);
    await pick(page, 'dark');
    // Record the class at every swap, as late as the router lets us see it.
    await page.evaluate(() => {
      const w = window as unknown as {__swaps: string[]};
      w.__swaps = [];
      document.addEventListener('astro:after-swap', () =>
        w.__swaps.push(document.documentElement.className),
      );
    });
    await page
      .getByRole('link', {name: site().navLinkName, exact: true})
      .click();
    await expect
      .poll(() => new URL(page.url()).pathname)
      .toBe(site().navTarget);
    const swaps = await page.evaluate(
      () => (window as unknown as {__swaps: string[]}).__swaps,
    );
    expect(swaps.length).toBeGreaterThan(0);
    for (const cls of swaps) expect(cls.split(/\s+/)).toContain('dark');
  });

  test('the right class is on <html> before first paint', async ({browser}) => {
    test.skip(
      !isNew(),
      'The old site sets the class from React after load, so it flashes by design.',
    );
    const baseURL = test.info().project.use.baseURL;
    // OS is light, saved choice is dark: any flash would show up as "light".
    const context = await browser.newContext({baseURL, colorScheme: 'light'});
    await context.addInitScript(() => {
      if (!localStorage.getItem('theme')) {
        localStorage.setItem(
          'theme',
          JSON.stringify({theme: 'dark', followSystem: false}),
        );
      }
      const w = window as unknown as {__seen: Record<string, string>};
      w.__seen = {};
      // Fires as soon as the parser creates <body>: before anything is painted
      // and before any module script (so before any island hydrates).
      const observer = new MutationObserver(() => {
        if (document.body && !w.__seen.body) {
          w.__seen.body = document.documentElement.className;
          observer.disconnect();
        }
      });
      observer.observe(document, {childList: true, subtree: true});
      document.addEventListener('DOMContentLoaded', () => {
        w.__seen.domContentLoaded = document.documentElement.className;
      });
    });
    const page = await context.newPage();
    // Block every script bundle: the class must come from the inline script alone.
    await page.route('**/_astro/**/*.js', (route) => route.abort());
    await page.goto(site().home);
    const seen = await page.evaluate(
      () => (window as unknown as {__seen: Record<string, string>}).__seen,
    );
    expect(seen.body.split(/\s+/)).toContain('dark');
    expect(seen.domContentLoaded.split(/\s+/)).toContain('dark');
    expect(await page.locator('astro-island:not([ssr])').count()).toBe(0);
    await context.close();
  });

  test('changing the theme updates an editor that is already open', async ({
    page,
  }) => {
    await page.emulateMedia({colorScheme: 'light'});
    await open(page, site().editorPage);
    // @uiw/react-codemirror puts cm-theme-light / cm-theme-dark on the wrapper
    // around .cm-editor. Wait for the editor itself so the editor is really open.
    await expect(page.locator('.CodeEditor .cm-editor').first()).toBeVisible();
    const editor = page.locator('.CodeEditor [class*="cm-theme"]').first();
    await editor.scrollIntoViewIfNeeded();

    await expect(editor).toHaveClass(/cm-theme-light/);
    await pick(page, 'dark');
    await expect(editor).toHaveClass(/cm-theme-dark/);
    await pick(page, 'light');
    await expect(editor).toHaveClass(/cm-theme-light/);
  });
});
