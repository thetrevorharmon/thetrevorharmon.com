import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {
  expect,
  type APIRequestContext,
  type Page,
  type TestInfo,
} from '@playwright/test';
import {extractPage, type PageFacts} from '../../scripts/parity/extract.mjs';
import {
  animatedMaskSelectors,
  mermaidBoxHeight,
  mermaidMaskSelectors,
  optionalOnNew,
  readingTimePattern,
} from './expected-differences';

export interface Baseline {
  site: string;
  counts: Record<string, number>;
  htmlPaths: string[];
  sitemap: string[];
  sitemapPaths: string[];
  rss: {guid: string; link: string; title: string; pubDate: string}[];
  robotsTxt: string | null;
  redirects: {from: string; to: string; status: number}[];
  pages: Record<string, PageFacts>;
}

export const baseline: Baseline = JSON.parse(
  fs.readFileSync(
    fileURLToPath(new URL('./baseline.json', import.meta.url)),
    'utf8',
  ),
);

/** Every page we test: the old sitemap, plus /404/ and /drafts/. */
export const PAGES: string[] = [...baseline.sitemapPaths, '/404/', '/drafts/'];

export function slugFor(pagePath: string): string {
  return pagePath === '/'
    ? 'home'
    : pagePath.replace(/^\/|\/$/g, '').replace(/\//g, '--');
}

const htmlCache = new WeakMap<
  APIRequestContext,
  Map<string, Promise<{status: number; html: string}>>
>();

/**
 * GETs a path (cached per request context) and returns status + body. By default
 * redirects are not followed, so a 301 shows up as a 301.
 */
export function getPage(
  request: APIRequestContext,
  pagePath: string,
  followRedirects = false,
) {
  let cache = htmlCache.get(request);
  if (!cache) {
    cache = new Map();
    htmlCache.set(request, cache);
  }
  const key = `${followRedirects ? 'follow' : 'exact'}:${pagePath}`;
  let hit = cache.get(key);
  if (!hit) {
    hit = request
      .get(pagePath, {maxRedirects: followRedirects ? 20 : 0})
      .then(async (res) => ({
        status: res.status(),
        html: await res.text(),
      }));
    cache.set(key, hit);
  }
  return hit;
}

/** Skips the test when an optional page (see allowlist) is absent on the new site. */
export async function skipIfOptionalAndMissing(
  request: APIRequestContext,
  pagePath: string,
  testInfo: TestInfo,
  skip: (condition: boolean, description: string) => void,
) {
  if (testInfo.project.name !== 'new' || !optionalOnNew.includes(pagePath))
    return;
  const {status} = await getPage(request, pagePath);
  skip(status === 404, `${pagePath} is allowed to be missing on the new site`);
}

export async function getFacts(request: APIRequestContext, pagePath: string) {
  const {status, html} = await getPage(request, pagePath);
  return {status, facts: extractPage(html)};
}

/** Scrolls the page so lazy images load, then waits for fonts and images. */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      (img as HTMLImageElement).loading = 'eager';
    });
    const step = Math.max(window.innerHeight - 100, 200);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.waitForFunction(() =>
    Array.from(document.images).every((img) => img.complete),
  );
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(400);
}

/**
 * Makes a page deterministic for screenshots:
 * - hides the random reading-list tiles (heading and intro stay visible, and
 *   their structure is checked separately in content.spec.ts)
 * - rewrites "N min read" to "0 min read" (allowlisted difference)
 * - gives each Mermaid diagram box the same fixed height on both sites, because
 *   the two renderers lay a diagram out at slightly different heights (see
 *   `mermaidBoxHeight`); the box is masked in the screenshot
 */
export async function neutralize(page: Page) {
  await page.evaluate(
    ({readingTime, mermaid}) => {
      const re = new RegExp(readingTime.source);
      document.querySelectorAll<HTMLElement>(mermaid.selector).forEach((el) => {
        el.style.height = `${mermaid.height}px`;
        el.style.overflow = 'hidden';
        // Masks use an element's full size even when it is clipped, so a tall
        // diagram would mask the text below its box.
        el.querySelectorAll<SVGElement>('svg').forEach((svg) => {
          svg.style.display = 'none';
        });
      });
      document.querySelectorAll('h2').forEach((h2) => {
        if (
          /^Want to (keep reading|see more)\?$/.test(
            h2.textContent?.trim() ?? '',
          )
        ) {
          const tiles = h2.parentElement?.parentElement?.lastElementChild;
          if (tiles && tiles !== h2.parentElement) {
            (tiles as HTMLElement).style.display = 'none';
          }
        }
      });
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
      );
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (re.test(node.nodeValue ?? '')) {
          node.nodeValue = (node.nodeValue ?? '').replace(
            /\d+ min read/,
            '0 min read',
          );
        }
      }
    },
    {
      readingTime: {source: readingTimePattern.source},
      mermaid: {selector: '.Mermaid', height: mermaidBoxHeight},
    },
  );
}

export function screenshotMasks(page: Page) {
  return [...mermaidMaskSelectors, ...animatedMaskSelectors].map((s) =>
    page.locator(s),
  );
}

export {expect};
