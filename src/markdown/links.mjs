// Link handling that the old gatsby-remark-external-links and the old site's
// server redirects used to do.
import {defineHastPlugin} from 'satteri';
import satteriExternalLinks from 'satteri-external-links';

const SITE_HOSTS = ['thetrevorharmon.com', 'www.thetrevorharmon.com'];

/** http(s) links open in a new tab, with the same rel as the old plugin. */
export const externalLinks = () =>
  satteriExternalLinks({
    rel: ['nofollow', 'noopener', 'noreferrer'],
    target: '_blank',
  });

/**
 * Adds the trailing slash that every page URL has on this site:
 * `/blog/foo` -> `/blog/foo/`, `https://thetrevorharmon.com/blog/foo#x` ->
 * `https://thetrevorharmon.com/blog/foo/#x`. The hash and query stay put.
 * Links to files (anything with an extension, like `/rss.xml`) are left alone.
 */
export function withTrailingSlash(href) {
  const match = href.match(
    /^(?:(https?:)?\/\/([^/?#]+))?(\/[^?#]*)?([?#].*)?$/i,
  );
  if (match == null) return href;
  const [, protocol, host, path, rest = ''] = match;
  const origin = host == null ? '' : `${protocol ?? ''}//${host}`;
  if (host != null && !SITE_HOSTS.includes(host.toLowerCase())) return href;
  // A bare "//host" with no path, or a link with no path at all ("#x", "?q").
  if (path == null || path === '/' || path.endsWith('/')) return href;
  if (/\.[A-Za-z0-9]+$/.test(path.split('/').pop())) return href;
  return `${origin}${path}/${rest}`;
}

export const internalLinkSlashes = () =>
  defineHastPlugin({
    name: 'internal-link-slashes',
    element: {
      filter: ['a'],
      visit(node, ctx) {
        const href = node.properties?.href;
        if (typeof href !== 'string') return;
        const fixed = withTrailingSlash(href);
        if (fixed !== href) ctx.setProperty(node, 'href', fixed);
      },
    },
  });
