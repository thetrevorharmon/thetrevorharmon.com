import {expect, test} from '@playwright/test';
import {knownBrokenLinks} from './expected-differences';
import {
  baseline,
  getFacts,
  getPage,
  PAGES,
  skipIfOptionalAndMissing,
} from './support';

test.describe('Links', () => {
  for (const pagePath of PAGES) {
    test(`${pagePath} outgoing links match the old site`, async ({
      request,
    }, testInfo) => {
      await skipIfOptionalAndMissing(request, pagePath, testInfo, test.skip);
      const {facts} = await getFacts(request, pagePath);
      expect(facts.outgoingLinks).toEqual(
        baseline.pages[pagePath].outgoingLinks,
      );
    });

    test(`${pagePath} internal links and anchors resolve`, async ({
      request,
    }, testInfo) => {
      await skipIfOptionalAndMissing(request, pagePath, testInfo, test.skip);
      const {facts} = await getFacts(request, pagePath);
      const base = new URL(pagePath, 'http://page.test');
      const problems: string[] = [];

      for (const href of new Set(facts.internalLinks)) {
        const url = new URL(href, base);
        const target = url.pathname;
        const hash = decodeURIComponent(url.hash.slice(1));
        if (target !== pagePath) {
          const res = await getPage(request, target, true);
          if (res.status !== 200) problems.push(`${href} -> ${res.status}`);
        }
        if (hash) {
          const res = await getPage(request, target, true);
          const escaped = hash.replace(/"/g, '&quot;');
          if (!res.html.includes(`id="${escaped}"`)) {
            problems.push(`${href} -> no element with id "${hash}"`);
          }
        }
      }
      const known = knownBrokenLinks
        .filter((k) => k.page === pagePath)
        .map((k) => k.href);
      expect(
        problems.filter(
          (p) => !known.some((href) => p.startsWith(`${href} ->`)),
        ),
      ).toEqual([]);
    });
  }
});
