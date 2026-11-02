// Small pure helpers shared by pages and components.

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** "DD MMM YYYY" in UTC, like the old site (`06 Jun 2019`). */
export function formatDate(date: Date | undefined | null): string | null {
  if (date == null) return null;
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/**
 * Site paths end in a slash (`trailingSlash: 'always'`). Gatsby's Link added it
 * for us, so do the same for internal paths. External URLs, hashes and file
 * paths (anything with an extension) are left alone.
 */
export function withTrailingSlash(url: string): string {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  const match = url.match(/^([^?#]*)(.*)$/);
  const path = match?.[1] ?? url;
  const rest = match?.[2] ?? '';
  const lastSegment = path.split('/').pop() ?? '';
  if (path.endsWith('/') || lastSegment.includes('.')) return url;
  return `${path}/${rest}`;
}

/**
 * A short plain-text teaser from a markdown body, for link-post tiles. Strips
 * the markup, then cuts at a word boundary and adds an ellipsis.
 */
export function excerpt(body: string | undefined, length = 140): string {
  const plain = (body ?? '')
    .replace(/^\s*(import|export)\s.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= length) return plain;
  const cut = plain.slice(0, length - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
