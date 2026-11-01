import {expect, test} from '@playwright/test';
import {imageResamplingTolerance} from './expected-differences';
import {
  neutralize,
  PAGES,
  screenshotMasks,
  settle,
  skipIfOptionalAndMissing,
  slugFor,
} from './support';

const VIEWPORTS = [
  {name: '1280', width: 1280, height: 800},
  {name: '390', width: 390, height: 844},
];
const SCHEMES = ['light', 'dark'] as const;

test.describe('Visual', () => {
  for (const pagePath of PAGES) {
    for (const viewport of VIEWPORTS) {
      for (const scheme of SCHEMES) {
        test(`${pagePath} ${scheme} ${viewport.name}`, async ({
          page,
          request,
        }, testInfo) => {
          await skipIfOptionalAndMissing(
            request,
            pagePath,
            testInfo,
            test.skip,
          );
          await page.setViewportSize({
            width: viewport.width,
            height: viewport.height,
          });
          await page.emulateMedia({
            colorScheme: scheme,
            reducedMotion: 'reduce',
          });
          await page.goto(pagePath, {waitUntil: 'load'});
          await settle(page);
          await neutralize(page);
          await expect(page).toHaveScreenshot(
            `${slugFor(pagePath)}-${scheme}-${viewport.name}.png`,
            {
              fullPage: true,
              mask: screenshotMasks(page),
              ...(imageResamplingTolerance[pagePath] != null && {
                maxDiffPixelRatio: imageResamplingTolerance[pagePath],
              }),
            },
          );
        });
      }
    }
  }
});
