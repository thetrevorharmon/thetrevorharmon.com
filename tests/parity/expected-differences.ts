// The one place where we accept a difference between the old (Gatsby) and new
// (Astro) site. Anything that differs and is NOT listed here is a regression.
// See docs/plan.md, "Ground rules".

/**
 * Pages that may be missing on the new site. If the new site serves them they
 * are compared like any other page; if it returns 404 their tests are skipped.
 * Reason: /drafts is an author-only page and may be dropped or rebuilt.
 */
export const optionalOnNew = ['/drafts/'];

/**
 * Reading-time numbers ("5 min read") are computed by different code in the
 * new site, so the number can change. The visual tests rewrite the digits to 0
 * before taking a screenshot. The text itself must still be present.
 */
export const readingTimePattern = /\b\d+ min read\b/;

/**
 * Mermaid diagrams are rendered differently in the new site (see Phase 2 and
 * 6.3). The visual tests mask these elements. Layout shifts caused by a
 * different diagram height still show up as a diff; review those by hand and
 * sign them off in Phase 6.3.
 */
export const mermaidMaskSelectors = ['.Mermaid', 'svg[id^="mermaid"]'];

/**
 * Animated gifs show a different frame on each run, so they are masked in
 * screenshots. (Phase 6.4 checks separately that they still animate.)
 */
export const animatedMaskSelectors = ['img[src*=".gif"]'];

/**
 * Hashed asset URLs (`/static/<hash>/...`, `/_astro/name.<hash>.ext`) change on
 * every build. Tests never compare asset URLs, and this normalizer is used when
 * a link or image URL has to be compared.
 */
export function normalizeAssetUrl(url: string): string {
  return url
    .replace(/\/static\/[0-9a-f]{32}\/[0-9a-f]+\//, '/static/<hash>/')
    .replace(/\/[0-9a-f]{32}\//, '/<hash>/')
    .replace(/\/_astro\/([^./]+)\.[A-Za-z0-9_-]{8}\./, '/_astro/$1.<hash>.')
    .replace(/\?v=[0-9a-f]+/, '');
}

/**
 * Console messages and failed requests that are known and accepted. Each entry
 * needs a reason. Empty on purpose: add to it only after review.
 */
export const allowedConsoleIssues: {pattern: RegExp; reason: string}[] = [];

/**
 * RSS fields that are never compared (they change on every build).
 * Items are compared on guid, link, title and pubDate only.
 */
export const ignoredRssChannelFields = ['lastBuildDate', 'generator'];

/**
 * Internal links that are already broken on the old site (the target id does
 * not exist). They are tolerated, not required: if the new site fixes one, the
 * test still passes. Found by the suite in Phase 1; fix them in the post
 * content separately if you care.
 */
export const knownBrokenLinks: {page: string; href: string; reason: string}[] =
  [
    {
      page: '/blog/staticquery-and-typescript/',
      href: '#update',
      reason:
        'No heading with id "update"; the real id is "update-the-usestaticquery-hook".',
    },
    {
      page: '/blog/the-value-of-iterative-design/',
      href: '#principles',
      reason: 'No element with id "principles" on the old site.',
    },
  ];
