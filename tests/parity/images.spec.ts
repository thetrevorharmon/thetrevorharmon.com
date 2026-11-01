import {expect, test, type Page} from '@playwright/test';

// Blurred image placeholders (src/lib/lqip.mjs). The old site had them too
// (gatsby-plugin-image). New site only; the old one was checked by eye.
//
// Image files are held back with `page.route` until the test lets them go, so
// the "still loading" state can be measured.
//
// The placeholder is a `background` (on the `<img>` for markdown and carousel
// images, on the wrapper for `Image.astro`) and the image paints over it. There
// is no fade, so LCP is not delayed.

// A post with a featured image and several markdown images.
const POST = '/blog/the-value-of-iterative-design/';
const POST_NAME = 'The value of iterative design';
const MD = '[data-md-image]';
// The wrapper of the featured image at the top of a post.
const FEATURED = '.Breakout > div:has(> img[fetchpriority="high"])';

// eslint-disable-next-line no-empty-pattern -- Playwright needs the destructuring
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== 'new', 'Astro site only');
});

/** Holds back every optimized image until `release()` is called. */
async function holdImages(page: Page) {
  let release!: () => void;
  const released = new Promise<void>((resolve) => (release = resolve));
  await page.route(
    /(\/_astro\/.*\.(webp|png|jpe?g|gif)|[?]hold)$/,
    async (route) => {
      await released;
      await route.continue();
    },
  );
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

const allLoaded = (page: Page, selector: string) =>
  page.$$eval(selector, (els) => {
    els.forEach((el) => el.scrollIntoView());
    return els.every(
      (el) =>
        (el as HTMLImageElement).complete &&
        (el as HTMLImageElement).naturalWidth > 0,
    );
  });

/** While loading: placeholders show. After: boxes are the same size. */
async function checkPostImages(page: Page, release: () => void) {
  expect(await page.locator(MD).count()).toBeGreaterThan(0);
  expect((await placeholders(page, MD)).every(Boolean)).toBe(true);
  expect((await placeholders(page, FEATURED)).every(Boolean)).toBe(true);
  const before = {
    md: await boxes(page, MD),
    featured: await boxes(page, FEATURED),
  };
  expect(before.featured).toHaveLength(1);
  expect(before.featured[0]).not.toMatch(/x0$/);

  release();
  await expect.poll(() => allLoaded(page, `${MD}, ${FEATURED} img`)).toBe(true);
  // No layout shift, and nothing is left see-through or hidden.
  expect(await boxes(page, MD)).toEqual(before.md);
  expect(await boxes(page, FEATURED)).toEqual(before.featured);
  await expect(page.locator(`${FEATURED} img`)).toHaveCSS('opacity', '1');
}

test('a post: placeholders show, boxes are final, images end fully opaque', async ({
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

test('a carousel photo has a placeholder behind it', async ({page}) => {
  const release = await holdImages(page);
  await page.goto('/pumpkins/', {waitUntil: 'domcontentloaded'});
  const photos = '.Carousel-Image img';
  expect((await placeholders(page, photos)).every(Boolean)).toBe(true);
  const before = await boxes(page, photos);
  release();
  await expect
    .poll(() =>
      page.$$eval(photos, (els) =>
        els.some((el) => (el as HTMLImageElement).complete),
      ),
    )
    .toBe(true);
  expect(await boxes(page, photos)).toEqual(before);
});

test('gifs have no placeholder', async ({page}) => {
  await page.goto('/about/');
  const gifs = 'img[src$=".gif"]';
  const count = await page.locator(gifs).count();
  expect(count).toBeGreaterThan(0);
  expect(
    await page.$$eval(gifs, (els) =>
      els.map((el) => getComputedStyle(el).backgroundImage),
    ),
  ).toEqual(Array(count).fill('none'));
});
