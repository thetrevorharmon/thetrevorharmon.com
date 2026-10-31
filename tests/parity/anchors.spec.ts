import {expect, test} from '@playwright/test';
import {baseline, getFacts, PAGES, skipIfOptionalAndMissing} from './support';

test.describe('Anchors', () => {
  for (const pagePath of PAGES) {
    test(`${pagePath} heading and footnote ids`, async ({
      request,
    }, testInfo) => {
      await skipIfOptionalAndMissing(request, pagePath, testInfo, test.skip);
      const {facts} = await getFacts(request, pagePath);
      const expected = baseline.pages[pagePath];
      expect(facts.headingIds).toEqual(expected.headingIds);
      expect(facts.footnoteIds).toEqual(expected.footnoteIds);
      expect(facts.footnoteLinks).toEqual(expected.footnoteLinks);
    });
  }
});
