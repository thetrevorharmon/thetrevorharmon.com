// Lighthouse old vs new: median of N runs, mobile and desktop.
//
//   node scripts/parity/lighthouse.mjs [--runs 3] [--out lighthouse-results.json] [--only old|new]
//
// Env: OLD_URL (default http://localhost:9000), NEW_URL (default
// http://localhost:4321). Set CHROME_PATH to a Chrome/Chromium binary, or
// Playwright's chromium is used. Servers must already be running.
// `astro preview` and `gatsby serve` do not behave like the production CDN
// (compression, caching), so transfer sizes are only a rough comparison.
import {execFileSync} from 'node:child_process';
import {mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {chromium} from '@playwright/test';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const runs = Number(opt('runs', 3));
const outFile = opt('out', 'lighthouse-results.json');
const sites = {
  old: process.env.OLD_URL ?? 'http://localhost:9000',
  new: process.env.NEW_URL ?? 'http://localhost:4321',
};
if (opt('only')) {
  for (const k of Object.keys(sites)) if (k !== opt('only')) delete sites[k];
}
const pages = [
  '/',
  '/blog/designing-for-michael-barrow-and-the-tourists/', // most images (15)
  '/blog/learning-codemirror/', // demo post
];
const presets = ['mobile', 'desktop'];
const chromePath = process.env.CHROME_PATH ?? chromium.executablePath();
const tmp = mkdtempSync(join(tmpdir(), 'lh-'));

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

function runOnce(url, preset, n) {
  const out = join(tmp, `${n}.json`);
  const flags = [
    '--yes',
    'lighthouse@12.8.2',
    url,
    '--quiet',
    '--output=json',
    `--output-path=${out}`,
    '--chrome-flags=--headless=new --no-sandbox',
  ];
  if (preset === 'desktop') flags.push('--preset=desktop');
  execFileSync('npx', flags, {
    env: {...process.env, CHROME_PATH: chromePath},
    stdio: ['ignore', 'ignore', 'inherit'],
  });
  const r = JSON.parse(readFileSync(out, 'utf8'));
  const a = r.audits;
  return {
    performance: Math.round(r.categories.performance.score * 100),
    accessibility: Math.round(r.categories.accessibility.score * 100),
    bestPractices: Math.round(r.categories['best-practices'].score * 100),
    seo: Math.round(r.categories.seo.score * 100),
    lcp: a['largest-contentful-paint'].numericValue,
    cls: a['cumulative-layout-shift'].numericValue,
    tbt: a['total-blocking-time'].numericValue,
    bytes: a['total-byte-weight'].numericValue,
  };
}

const results = [];
let n = 0;
for (const preset of presets) {
  for (const path of pages) {
    for (const [site, base] of Object.entries(sites)) {
      const samples = [];
      for (let i = 0; i < runs; i++) {
        samples.push(runOnce(base + path, preset, n++));
      }
      const med = {};
      for (const k of Object.keys(samples[0])) {
        med[k] = median(samples.map((s) => s[k]));
      }
      results.push({preset, path, site, median: med, samples});
      console.log(preset, path, site, JSON.stringify(med));
    }
  }
}
writeFileSync(outFile, JSON.stringify(results, null, 2));

console.log('\n| preset | page | site | Perf | A11y | BP | SEO | LCP ms | CLS | TBT ms | KB |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|');
for (const {preset, path, site, median: m} of results) {
  console.log(
    `| ${preset} | ${path} | ${site} | ${m.performance} | ${m.accessibility} | ${m.bestPractices} | ${m.seo} | ${Math.round(m.lcp)} | ${m.cls.toFixed(3)} | ${Math.round(m.tbt)} | ${Math.round(m.bytes / 1024)} |`,
  );
}
