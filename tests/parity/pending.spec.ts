import {test} from '@playwright/test';
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
  // slash also matches the path with one. So a later rule for the same path is
  // unreachable, and we expect the earlier rule's target.
  const normalize = (p: string) => p.replace(/\/$/, '');
  const firstMatch = new Map<string, {to: string; status: number}>();
  for (const {from, to, status} of baseline.redirects) {
    if (!firstMatch.has(normalize(from))) {
      firstMatch.set(normalize(from), {to, status});
    }
  }

  for (const {from, to: ruleTo, status: ruleStatus} of baseline.redirects) {
    const {to, status} = firstMatch.get(normalize(from))!;
    const shadowed = to !== ruleTo || status !== ruleStatus;
    test(`${from} -> ${to}${shadowed ? ` (rule to ${ruleTo} is shadowed)` : ''}`, async ({
      request,
    }) => {
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

// Performance is not a Playwright test: run `yarn lighthouse` (scripts/parity/lighthouse.mjs)
// and `node scripts/parity/js-payload.mjs`. Results are in docs/plan.md, Phase 9.
