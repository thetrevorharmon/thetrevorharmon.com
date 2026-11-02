import {test} from '@playwright/test';
import {expectedRedirectDifferences} from './expected-differences';
import {baseline} from './support';

// These checks need a different environment (a Netlify deploy preview). They are
// skipped with the reason, so the report shows "skipped", not "passed".

test.describe('Redirects (deploy preview only)', () => {
  const previewUrl = process.env.DEPLOY_PREVIEW_URL;

  test.skip(
    !previewUrl,
    'Netlify applies public/_redirects. `gatsby serve` and `astro preview` do not, so set DEPLOY_PREVIEW_URL to run this.',
  );

  // Netlify uses the first rule that matches, and a rule without a trailing
  // slash also matches the path with one. So we expect the first baseline rule
  // for a path (production behavior), except where the new site intentionally
  // differs (expectedRedirectDifferences).
  const normalize = (p: string) => p.replace(/\/$/, '');
  const expected = new Map<
    string,
    {to: string; status: number; note?: string}
  >();
  for (const {from, to, status} of baseline.redirects) {
    if (!expected.has(normalize(from))) {
      expected.set(normalize(from), {to, status});
    }
  }
  for (const {from, to, status, reason} of expectedRedirectDifferences) {
    expected.set(normalize(from), {to, status, note: reason});
  }

  for (const [from, {to, status, note}] of expected) {
    for (const path of [from, `${from}/`]) {
      test(`${path} -> ${to}${note ? ' (expected difference from production)' : ''}`, async ({
        request,
      }) => {
        const res = await request.get(new URL(path, previewUrl).toString(), {
          maxRedirects: 0,
        });
        test.expect(res.status()).toBe(status);
        test
          .expect(new URL(res.headers()['location'], previewUrl).pathname)
          .toBe(to);
      });
    }
  }
});

// Performance is not a Playwright test: run `yarn lighthouse` (scripts/parity/lighthouse.mjs)
// and `node scripts/parity/js-payload.mjs`. Results are in docs/plan.md, Phase 9.
