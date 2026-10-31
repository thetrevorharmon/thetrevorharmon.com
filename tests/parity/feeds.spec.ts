import {expect, test} from '@playwright/test';
import {extractRss} from '../../scripts/parity/extract.mjs';
import {baseline, getPage} from './support';

test.describe('Feeds and static files', () => {
  test('rss.xml items match the baseline (guid, link, title, pubDate)', async ({
    request,
  }) => {
    const {status, html} = await getPage(request, '/rss.xml');
    expect(status).toBe(200);
    expect(extractRss(html)).toEqual(baseline.rss);
  });

  test('robots.txt matches the baseline', async ({request}) => {
    const {status, html} = await getPage(request, '/robots.txt');
    expect(status).toBe(200);
    expect(html).toBe(baseline.robotsTxt);
  });

  test('manifest.webmanifest is valid JSON and its icons load', async ({
    request,
  }) => {
    const {status, html} = await getPage(request, '/manifest.webmanifest');
    expect(status).toBe(200);
    const manifest = JSON.parse(html);
    expect(manifest.icons.length).toBeGreaterThan(0);
    for (const icon of manifest.icons) {
      const res = await request.get(`/${icon.src.replace(/^\//, '')}`);
      expect(res.status(), icon.src).toBe(200);
    }
  });
});
