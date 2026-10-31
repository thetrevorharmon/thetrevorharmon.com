// Reads the OLD (Gatsby) build output and writes tests/parity/baseline.json.
//
//   node scripts/parity/inventory.mjs [path-to-old-public-dir]
//
// The default is ../thetrevorharmon.com-gatsby/public (the gatsby-final
// worktree). Run it again only if the old build changes.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {extractPage, extractRss, extractSitemap} from './extract.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');
const publicDir = path.resolve(
  process.argv[2] ??
    path.join(repoRoot, '../thetrevorharmon.com-gatsby/public'),
);
const outFile = path.join(repoRoot, 'tests/parity/baseline.json');
const SITE = 'https://thetrevorharmon.com';

if (!fs.existsSync(path.join(publicDir, 'index.html'))) {
  console.error(`No Gatsby build found at ${publicDir}. Run yarn build there.`);
  process.exit(1);
}

// Directories in a Gatsby build that hold assets or data, not pages.
const SKIP_DIRS = new Set([
  '_gatsby',
  '~partytown',
  'page-data',
  'static',
  'icons',
]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (dir === publicDir && SKIP_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function toUrlPath(file) {
  const rel = path.relative(publicDir, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html'))
    return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

const htmlFiles = walk(publicDir).sort();
const htmlPaths = htmlFiles.map(toUrlPath).sort();

const sitemapXml = fs.readFileSync(
  path.join(publicDir, 'sitemap-0.xml'),
  'utf8',
);
const sitemap = extractSitemap(sitemapXml);
const sitemapPaths = sitemap.map((loc) => new URL(loc).pathname);

const rss = extractRss(
  fs.readFileSync(path.join(publicDir, 'rss.xml'), 'utf8'),
);

const pages = {};
for (const file of htmlFiles) {
  pages[toUrlPath(file)] = extractPage(fs.readFileSync(file, 'utf8'));
}

function readIfExists(name) {
  const file = path.join(publicDir, name);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

const redirects = (readIfExists('_redirects') ?? '')
  .split('\n')
  .map((line) => line.trim().split(/\s+/))
  .filter((parts) => parts.length >= 3 && parts[0].startsWith('/'))
  .map(([from, to, status]) => ({from, to, status: Number(status)}));

const blogPostPaths = htmlPaths.filter(
  (p) => p.startsWith('/blog/') && p !== '/blog/',
);

const postSlugs = new Set(
  blogPostPaths.map((p) => `${SITE}${p.replace(/\/$/, '')}`),
);
const rssNotPosts = rss.filter((i) => !postSlugs.has(i.link));
const postsNotInRss = [...postSlugs].filter(
  (s) => !rss.some((i) => i.link === s),
);

const baseline = {
  site: SITE,
  counts: {
    htmlPaths: htmlPaths.length,
    blogPosts: blogPostPaths.length,
    sitemapEntries: sitemap.length,
    rssItems: rss.length,
    redirects: redirects.length,
  },
  htmlPaths,
  sitemap,
  sitemapPaths,
  rss,
  // Post pages that are built but not in the feed (the feed only has status: Published).
  postsNotInRss,
  robotsTxt: readIfExists('robots.txt'),
  redirects,
  pages,
};

fs.writeFileSync(outFile, `${JSON.stringify(baseline, null, 2)}\n`);

// Plan checks (docs/plan.md, task 1.3).
const published = htmlPaths.filter(
  (p) => p !== '/404/' && p !== '/404.html' && p !== '/drafts/',
);
const sitemapSet = new Set(sitemapPaths);
const missingFromSitemap = published.filter((p) => !sitemapSet.has(p));
const notInHtml = sitemapPaths.filter((p) => !htmlPaths.includes(p));
console.log(`Wrote ${path.relative(repoRoot, outFile)}`);
console.log(JSON.stringify(baseline.counts, null, 2));
console.log(
  `published HTML pages (excluding /404, /drafts): ${published.length}`,
);
console.log(
  `published pages missing from sitemap: ${JSON.stringify(missingFromSitemap)}`,
);
console.log(`sitemap entries with no HTML: ${JSON.stringify(notInHtml)}`);
console.log(
  `RSS items that are not post pages: ${JSON.stringify(rssNotPosts.map((i) => i.link))}`,
);
console.log(`post pages missing from RSS: ${JSON.stringify(postsNotInRss)}`);
