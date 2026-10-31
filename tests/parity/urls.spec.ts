import {expect, test} from '@playwright/test';
import {extractSitemap} from '../../scripts/parity/extract.mjs';
import {baseline, getPage, PAGES, skipIfOptionalAndMissing} from './support';

test.describe('URL inventory', () => {
  for (const pagePath of PAGES) {
    test(`${pagePath} returns 200 at the same URL`, async ({
      request,
    }, testInfo) => {
      await skipIfOptionalAndMissing(request, pagePath, testInfo, test.skip);
      const res = await request.get(pagePath, {maxRedirects: 0});
      // No redirect (trailing slash is part of the URL), and it exists.
      expect(res.status()).toBe(200);
      expect(new URL(res.url()).pathname).toBe(pagePath);
    });
  }

  test('an unknown URL returns 404', async ({request}) => {
    const res = await request.get('/this-page-does-not-exist/', {
      maxRedirects: 0,
    });
    expect(res.status()).toBe(404);
  });

  test('sitemap lists exactly the old URLs (no unexpected new pages)', async ({
    request,
  }) => {
    const {status, html} = await getPage(request, '/sitemap-0.xml');
    expect(status).toBe(200);
    const paths = extractSitemap(html).map((loc) => new URL(loc).pathname);
    expect(paths.slice().sort()).toEqual(baseline.sitemapPaths.slice().sort());
    // Absolute URLs must keep pointing at production.
    for (const loc of extractSitemap(html)) {
      expect(loc.startsWith(baseline.site)).toBe(true);
    }
  });
});
