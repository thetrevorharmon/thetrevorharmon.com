// JS shipped per page, old vs new: every JS response loaded on first visit,
// gzipped by us (so the result doesn't depend on the dev server's compression).
//   node scripts/parity/js-payload.mjs [paths...]
import {gzipSync} from 'node:zlib';
import {chromium} from '@playwright/test';

const sites = {
  old: process.env.OLD_URL ?? 'http://localhost:9000',
  new: process.env.NEW_URL ?? 'http://localhost:4321',
};
const paths = process.argv.length > 2 ? process.argv.slice(2) : ['/', '/blog/', '/about/'];
const browser = await chromium.launch();
for (const path of paths) {
  for (const [name, base] of Object.entries(sites)) {
    const page = await browser.newPage();
    const files = new Map();
    page.on('response', async (res) => {
      const type = res.headers()['content-type'] ?? '';
      if (!/javascript/.test(type)) return;
      try {
        const body = await res.body();
        files.set(res.url(), {raw: body.length, gz: gzipSync(body, {level: 9}).length});
      } catch {
        // a response with no body (redirect, aborted request)
      }
    });
    await page.goto(base + path, {waitUntil: 'networkidle'});
    await page.waitForTimeout(500);
    const sum = (k) => [...files.values()].reduce((a, f) => a + f[k], 0);
    console.log(`${path} ${name}: ${files.size} files, ${(sum('gz') / 1024).toFixed(1)} KB gzip, ${(sum('raw') / 1024).toFixed(1)} KB raw`);
    await page.close();
  }
}
await browser.close();
