import {expect, test} from '@playwright/test';
import {normalizeSocialImage} from './expected-differences';
import {baseline, getFacts, PAGES, skipIfOptionalAndMissing} from './support';

test.describe('Metadata', () => {
  for (const pagePath of PAGES) {
    test(`${pagePath} title, description, canonical and OG tags`, async ({
      request,
    }, testInfo) => {
      await skipIfOptionalAndMissing(request, pagePath, testInfo, test.skip);
      const {facts} = await getFacts(request, pagePath);
      const expected = baseline.pages[pagePath];
      expect(expected, `${pagePath} missing from baseline.json`).toBeDefined();
      expect(facts.title).toBe(expected.title);
      expect(facts.description).toBe(expected.description);
      expect(facts.canonical).toBe(expected.canonical);
      // Only the og:image hash and folder may differ (see the allowlist).
      const withImage = (meta: Record<string, string>) => ({
        ...meta,
        ...(meta['og:image'] && {
          'og:image': normalizeSocialImage(meta['og:image']),
        }),
      });
      expect(withImage(facts.meta)).toEqual(withImage(expected.meta));
    });
  }
});
