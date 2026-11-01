import {expect, test, type Page} from '@playwright/test';

// Blurred image placeholders that fade into the sharp image (src/lib/lqip.mjs,
// the `[data-blur-up]` rules in global.scss, the script in BaseLayout.astro).
// The old site did the same with gatsby-plugin-image (250ms linear for
// GatsbyImage, 500ms ease for markdown images). New site only.
//
// Image files are held back with `page.route` until the test lets them go, so
// the "still loading" state can be measured.
//
// The wrapper (`[data-blur-up]`) has the placeholder as its background and the
// <img> fills it. The <img> starts at opacity 0 and gets `data-loaded` once it
// has loaded, which fades it to 1 on top of the blur.

// A post with a featured image and several markdown images.
const POST = '/blog/the-value-of-iterative-design/';
const POST_NAME = 'The value of iterative design';
const WRAPPERS = '[data-blur-up]';
const IMGS = '[data-blur-up] > img';
const MD = '[data-md-image][data-blur-up]';
// The wrapper of the featured image at the top of a post.
const FEATURED =
  '.Breakout > div[data-blur-up]:has(> img[fetchpriority="high"])';

// eslint-disable-next-line no-empty-pattern -- Playwright needs the destructuring
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== 'new', 'Astro site only');
});

/** Holds back every optimized image until `release()` is called. */
async function holdImages(page: Page) {
  let release!: () => void;
  const released = new Promise<void>((resolve) => (release = resolve));
  await page.route(/\/_astro\/.*\.(webp|png|jpe?g|gif)$/, async (route) => {
    await released;
    await route.continue();
  });
  return release;
}

const boxes = (page: Page, selector: string) =>
  page.$$eval(selector, (els) =>
    els.map((el) => {
      const {width, height} = el.getBoundingClientRect();
      return `${Math.round(width)}x${Math.round(height)}`;
    }),
  );

const placeholders = (page: Page, selector: string) =>
  page.$$eval(selector, (els) =>
    els.map((el) =>
      getComputedStyle(el).backgroundImage.startsWith('url("data:image/webp'),
    ),
  );

const opacities = (page: Page, selector: string) =>
  page.$$eval(selector, (els) =>
    els.map((el) => Number(getComputedStyle(el).opacity)),
  );

const allLoaded = (page: Page, selector: string) =>
  page.$$eval(selector, (els) => {
    els.forEach((el) => el.scrollIntoView());
    return els.every(
      (el) =>
        (el as HTMLImageElement).complete &&
        (el as HTMLImageElement).naturalWidth > 0 &&
        getComputedStyle(el).opacity === '1',
    );
  });

/** Records the opacity of `selector` on every frame, from now on. */
const recordOpacity = (page: Page, selector: string) =>
  page.evaluate((sel) => {
    const w = window as unknown as {__samples: number[]};
    w.__samples = [];
    const el = document.querySelector(sel)!;
    const tick = () => {
      w.__samples.push(Number(getComputedStyle(el).opacity));
      requestAnimationFrame(tick);
    };
    tick();
  }, selector);

const samples = (page: Page) =>
  page.evaluate(() => (window as unknown as {__samples: number[]}).__samples);

/** While held: blur shows, image is see-through. Then it fades to opaque. */
async function checkPostImages(page: Page, release: () => void) {
  expect(await page.locator(MD).count()).toBeGreaterThan(0);
  expect((await placeholders(page, WRAPPERS)).every(Boolean)).toBe(true);
  // The wrapper shows the blur and the image is transparent over it.
  await page.locator(FEATURED).scrollIntoViewIfNeeded();
  expect(await opacities(page, `${FEATURED} > img`)).toEqual([0]);
  expect(await opacities(page, `${MD} > img`)).toEqual(
    Array(await page.locator(MD).count()).fill(0),
  );
  const before = {
    md: await boxes(page, MD),
    featured: await boxes(page, FEATURED),
  };
  expect(before.featured).toHaveLength(1);
  expect(before.featured[0]).not.toMatch(/x0$/);

  await recordOpacity(page, `${FEATURED} > img`);
  release();
  await expect.poll(() => allLoaded(page, IMGS)).toBe(true);
  // It faded: some frame was strictly between 0 and 1, and values only rise.
  const seen = await samples(page);
  expect(seen.some((v) => v > 0 && v < 1)).toBe(true);
  expect(seen).toEqual([...seen].sort((a, b) => a - b));
  // No layout shift.
  expect(await boxes(page, MD)).toEqual(before.md);
  expect(await boxes(page, FEATURED)).toEqual(before.featured);
}

test('a post: blur shows, images fade in over it, boxes do not move', async ({
  page,
}) => {
  const release = await holdImages(page);
  await page.goto(POST, {waitUntil: 'domcontentloaded'});
  await checkPostImages(page, release);
});

test('the same holds for a post reached by client-router navigation', async ({
  page,
}) => {
  await page.goto('/blog/');
  await page.evaluate(
    () => ((window as unknown as {__same: boolean}).__same = true),
  );
  const release = await holdImages(page);
  await page
    .getByRole('link', {name: new RegExp(POST_NAME)})
    .first()
    .click();
  await page.waitForURL(`**${POST}`);
  // A full page load would have cleared this: it was a router swap.
  expect(
    await page.evaluate(() => (window as unknown as {__same?: boolean}).__same),
  ).toBe(true);
  await checkPostImages(page, release);
});

test('cached images are visible when the page is visited again', async ({
  page,
}) => {
  await page.goto(POST);
  await expect.poll(() => allLoaded(page, IMGS)).toBe(true);
  await page.goto('/blog/');
  await page.goBack({waitUntil: 'domcontentloaded'});
  await expect.poll(() => allLoaded(page, IMGS)).toBe(true);
  // And through the router.
  await page.evaluate(() => ((window as unknown as {__r: boolean}).__r = true));
  await page.getByRole('link', {name: 'Blog'}).first().click();
  await page.waitForURL('**/blog/');
  await page.goBack();
  await page.waitForURL(`**${POST}`);
  expect(
    await page.evaluate(() => (window as unknown as {__r?: boolean}).__r),
  ).toBe(true);
  await expect.poll(() => allLoaded(page, IMGS)).toBe(true);
});

test('without JavaScript the images show', async ({browser, baseURL}) => {
  const context = await browser.newContext({javaScriptEnabled: false});
  const page = await context.newPage();
  await page.goto(`${baseURL}${POST}`);
  expect(await page.locator(IMGS).count()).toBeGreaterThan(0);
  expect(await opacities(page, IMGS)).toEqual(
    Array(await page.locator(IMGS).count()).fill(1),
  );
  await expect.poll(() => allLoaded(page, IMGS)).toBe(true);
  await context.close();
});

test('with reduced motion there is no fade', async ({browser, baseURL}) => {
  const context = await browser.newContext({reducedMotion: 'reduce'});
  const page = await context.newPage();
  await page.goto(`${baseURL}${POST}`);
  const durations = await page.$$eval(IMGS, (els) =>
    els.map((el) => getComputedStyle(el).transitionDuration),
  );
  expect(durations.length).toBeGreaterThan(0);
  expect(durations.every((d) => d === '0s')).toBe(true);
  await context.close();
});

test('a carousel photo has a placeholder behind it and fades in', async ({
  page,
}) => {
  const release = await holdImages(page);
  await page.goto('/pumpkins/', {waitUntil: 'domcontentloaded'});
  const photos = '.Carousel-Image [data-blur-up]';
  expect((await placeholders(page, photos)).every(Boolean)).toBe(true);
  const first = `.Carousel-Image [data-blur-up] > img`;
  expect((await opacities(page, `${first}[loading]`)).slice(0, 1)).toEqual([0]);
  const before = await boxes(page, photos);
  release();
  await expect
    .poll(() =>
      page.$$eval(first, (els) =>
        els.some((el) => getComputedStyle(el).opacity === '1'),
      ),
    )
    .toBe(true);
  expect(await boxes(page, photos)).toEqual(before);
});

test('gifs are untouched: no wrapper, no placeholder', async ({page}) => {
  await page.goto('/about/');
  const gifs = 'img[src$=".gif"]';
  const count = await page.locator(gifs).count();
  expect(count).toBeGreaterThan(0);
  expect(
    await page.$$eval(gifs, (els) =>
      els.map((el) => [
        getComputedStyle(el).backgroundImage,
        getComputedStyle(el).opacity,
        el.parentElement?.hasAttribute('data-blur-up'),
      ]),
    ),
  ).toEqual(Array(count).fill(['none', '1', false]));
});

test('in print the images are visible even while loading', async ({page}) => {
  const release = await holdImages(page);
  await page.goto(POST, {waitUntil: 'domcontentloaded'});
  await page.emulateMedia({media: 'print'});
  const count = await page.locator(IMGS).count();
  expect(count).toBeGreaterThan(0);
  expect(await opacities(page, IMGS)).toEqual(Array(count).fill(1));
  release();
});
