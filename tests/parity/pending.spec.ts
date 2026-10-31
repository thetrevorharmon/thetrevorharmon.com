import {test} from '@playwright/test';
import {baseline} from './support';

// These checks need code that does not exist yet, or a different environment.
// They are listed here so Phase 9 has a place to fill in. Each one is skipped
// with the reason, so the report shows them as "skipped", not "passed".

test.describe('Demos (Phase 7)', () => {
  test.fixme(
    true,
    'Needs the demo components to work on the new site. One test per demo: editor loads, typing changes state, no console errors, survives ClientRouter navigation, follows theme (plan 7.1).',
  );
  test('demo posts', () => {});
});

test.describe('Redirects (deploy preview only)', () => {
  const previewUrl = process.env.DEPLOY_PREVIEW_URL;

  test.skip(
    !previewUrl,
    'Netlify applies public/_redirects. `gatsby serve` and `astro preview` do not, so set DEPLOY_PREVIEW_URL to run this.',
  );

  for (const {from, to, status} of baseline.redirects) {
    test(`${from} -> ${to}`, async ({request}) => {
      const res = await request.get(new URL(from, previewUrl).toString(), {
        maxRedirects: 0,
      });
      test.expect(res.status()).toBe(status);
      test
        .expect(new URL(res.headers()['location'], previewUrl).pathname)
        .toBe(to);
    });
  }
});

test.describe('Performance (Phase 9)', () => {
  test.fixme(
    true,
    'Lighthouse for /, an image-heavy post and a demo post, old vs new. Run by hand in Phase 9; not part of this suite.',
  );
  test('lighthouse', () => {});
});
