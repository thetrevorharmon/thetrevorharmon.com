import {expect, test} from '@playwright/test';
import {allowedConsoleIssues} from './expected-differences';
import {PAGES, skipIfOptionalAndMissing} from './support';

test.describe('Console and network', () => {
  for (const pagePath of PAGES) {
    test(`${pagePath} has no console errors or failed requests`, async ({
      page,
      request,
    }, testInfo) => {
      await skipIfOptionalAndMissing(request, pagePath, testInfo, test.skip);
      const issues: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') issues.push(`console.error: ${msg.text()}`);
      });
      page.on('pageerror', (err) => issues.push(`pageerror: ${err.message}`));
      page.on('requestfailed', (req) => {
        issues.push(
          `requestfailed: ${req.url()} (${req.failure()?.errorText})`,
        );
      });
      page.on('response', (res) => {
        // The /404/ page itself is allowed to answer with a 404 status.
        if (
          res.status() >= 400 &&
          !(pagePath === '/404/' && res.url().endsWith(pagePath))
        ) {
          issues.push(`http ${res.status()}: ${res.url()}`);
        }
      });

      await page.goto(pagePath, {waitUntil: 'load'});
      await page.waitForLoadState('networkidle');
      // Scroll so lazy resources are requested too.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
      });
      await page.waitForLoadState('networkidle');

      const unexpected = issues.filter(
        (issue) =>
          !allowedConsoleIssues.some(({pattern}) => pattern.test(issue)),
      );
      expect(unexpected).toEqual([]);
    });
  }
});
