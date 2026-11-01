// Sätteri (hast) port of the old plugins/rehype-better-footnote-links.
// Rewrites the default footnote ids to the ones the site already links to:
//   #user-content-fn-x    -> #footnote--x      (the <li> in the footnotes section)
//   #user-content-fnref-x -> #reference--x     (the <sup><a> reference in the text)
// and swaps the "↩" backref text for the arrow-return SVG.
const FOOTNOTE_PREFIX = 'user-content-fn-';
const REFERENCE_PREFIX = 'user-content-fnref-';

// Same icon as the Gatsby plugin's ARROW_RETURN_ICON, as a structured hast element
// ({raw} replacement is not accepted when compiling MDX).
const CLS = 'cls-6374f543b67f094e4896c5c8-1';
const TRANSFORM =
  'matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -2.220446049250313e-16, 0)';
const arrowReturnIcon = () => ({
  type: 'element',
  tagName: 'svg',
  properties: {
    viewBox: '0 0 24 24',
    width: '24px',
    height: '24px',
    'stroke-width': '2',
    xmlns: 'http://www.w3.org/2000/svg',
  },
  children: [
    {
      type: 'element',
      tagName: 'defs',
      properties: {},
      children: [
        {
          type: 'element',
          tagName: 'style',
          properties: {},
          children: [
            {
              type: 'text',
              value: `.${CLS}{fill:none;stroke:currentColor;stroke-miterlimit:10;}`,
            },
          ],
        },
      ],
    },
    {
      type: 'element',
      tagName: 'path',
      properties: {
        className: [CLS],
        d: 'M 5.357 5.144 L 14.466 5.144 C 16.984 5.144 19.026 7.186 19.026 9.704 C 19.02 12.218 16.98 14.253 14.466 14.253 L 5.357 14.253',
        transform: TRANSFORM,
      },
      children: [],
    },
    {
      type: 'element',
      tagName: 'polyline',
      properties: {
        className: [CLS],
        points: '9.905 18.813 5.357 14.253 9.905 9.692',
        transform: TRANSFORM,
      },
      children: [],
    },
  ],
});

const props = (node) => node.properties ?? {};
const has = (v) => v === true || v === '' || v === 'true';

export function betterFootnoteLinks() {
  return {
    name: 'better-footnote-links',
    element: {
      filter: ['a', 'li'],
      visit(node, ctx) {
        const p = props(node);

        if (
          node.tagName === 'li' &&
          typeof p.id === 'string' &&
          p.id.startsWith(FOOTNOTE_PREFIX)
        ) {
          ctx.setProperty(
            node,
            'id',
            p.id.replace(FOOTNOTE_PREFIX, 'footnote--'),
          );
          return;
        }

        if (node.tagName !== 'a') return;

        // reference in the text: <sup><a href="#user-content-fn-x" id="user-content-fnref-x">
        if (has(p.dataFootnoteRef) && typeof p.id === 'string') {
          ctx.setProperty(
            node,
            'id',
            p.id.replace(REFERENCE_PREFIX, 'reference--'),
          );
          ctx.setProperty(
            node,
            'href',
            String(p.href).replace(FOOTNOTE_PREFIX, 'footnote--'),
          );
          return;
        }

        // backlink in the footnote list
        if (has(p.dataFootnoteBackref)) {
          ctx.setProperty(
            node,
            'href',
            String(p.href).replace(REFERENCE_PREFIX, 'reference--'),
          );
          ctx.replaceNode(node.children[0], arrowReturnIcon());
        }
      },
    },
  };
}
