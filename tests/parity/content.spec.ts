import {expect, test} from '@playwright/test';
import {baseline, getFacts, PAGES, skipIfOptionalAndMissing} from './support';

test.describe('Content structure', () => {
  for (const pagePath of PAGES) {
    test(`${pagePath} images and reading list`, async ({request}, testInfo) => {
      await skipIfOptionalAndMissing(request, pagePath, testInfo, test.skip);
      const {facts} = await getFacts(request, pagePath);
      const expected = baseline.pages[pagePath];

      expect(facts.imageCount).toBe(expected.imageCount);
      expect(facts.imageAlts).toEqual(expected.imageAlts);

      // The reading list is random, so only its shape is compared.
      if (expected.readingList == null) {
        expect(facts.readingList).toBeNull();
        return;
      }
      const list = facts.readingList;
      expect(list).not.toBeNull();
      expect(list!.heading).toBe(expected.readingList.heading);
      expect(list!.description).toBe(expected.readingList.description);
      expect(list!.count).toBe(expected.readingList.count);
      for (const [i, link] of list!.links.entries()) {
        expect(link, `tile ${i} link`).toMatch(/^\/blog\/[^/]+\/$/);
        expect(baseline.htmlPaths, `tile ${i} points at a real page`).toContain(
          link,
        );
        expect(list!.dates[i], `tile ${i} date`).toMatch(
          /^\d{1,2} [A-Z][a-z]{2} \d{4}$/,
        );
      }
      expect(new Set(list!.links).size, 'tiles are unique').toBe(
        list!.links.length,
      );
      expect(list!.links, 'does not recommend itself').not.toContain(pagePath);
    });
  }
});
