import {visit} from 'unist-util-visit';

const FOOTNOTE_KEY_FROM_MDX_JS = `user-content-fn-`;
const REFERENCE_KEY_FROM_MDX_JS = `user-content-fnref-`;

const NEW_FOOTNOTE_KEY = 'footnote--';
const NEW_REFERENCE_KEY = 'reference--';

/**
 * This icon came from the arrow-return atlas icon (originally in a circle)
 * I removed the surrounding circle and made the arrow a bit bigger to look
 * better on the page.
 *
 * I can't directly pass an SVG within rehype because at this point, all the
 * HTML and Markdown has been parsed into an AST. I need to pass an AST version
 * of the SVG instead.
 *
 * I have saved this icon as arrow-undo.svg in the repo in case it is needed
 * in the future. I used ChatGPT to convert the svg into a rehype node.
 */
const ARROW_UNDO_ICON = {
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
      children: [
        {
          type: 'element',
          tagName: 'style',
          children: [
            {
              type: 'text',
              value:
                '.cls-6374f543b67f094e4896c5c8-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}',
            },
          ],
        },
      ],
    },
    {
      type: 'element',
      tagName: 'path',
      properties: {
        className: ['cls-6374f543b67f094e4896c5c8-1'],
        d: 'M 5.357 5.144 L 14.466 5.144 C 16.984 5.144 19.026 7.186 19.026 9.704 C 19.02 12.218 16.98 14.253 14.466 14.253 L 5.357 14.253',
        style: '',
        transform:
          'matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -2.220446049250313e-16, 0)',
      },
      children: [],
    },
    {
      type: 'element',
      tagName: 'polyline',
      properties: {
        className: ['cls-6374f543b67f094e4896c5c8-1'],
        points: '9.905 18.813 5.357 14.253 9.905 9.692',
        style: '',
        transform:
          'matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -2.220446049250313e-16, 0)',
      },
      children: [],
    },
  ],
};

/**
 * The default implementation for footnote links in @mdx/js
 * renders the links as #user-content-fn-{name} and #user-content-fnref-{name}
 * This choice seems very programmer-y to me, and since this data is exposed to
 * the user, I wanted to make it a bit better.
 *
 * This function rewrites the footnote links to be footnote--{name} and reference--{name}.
 */
export default function rehypeBetterFootnoteLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // link to reference
      if (
        node.tagName === 'a' &&
        node.properties &&
        node.properties.dataFootnoteRef === true &&
        node.properties.href != null &&
        node.properties.id != null
      ) {
        node.properties.href = node.properties.href.replace(
          FOOTNOTE_KEY_FROM_MDX_JS,
          NEW_FOOTNOTE_KEY,
        );

        node.properties.id = node.properties.id.replace(
          REFERENCE_KEY_FROM_MDX_JS,
          NEW_REFERENCE_KEY,
        );
      }

      // footnote reference
      if (
        node.tagName === 'li' &&
        node.properties &&
        node.properties.id != null &&
        new RegExp(`^${FOOTNOTE_KEY_FROM_MDX_JS}.*$`).test(node.properties.id)
      ) {
        node.properties.id = node.properties.id.replace(
          FOOTNOTE_KEY_FROM_MDX_JS,
          NEW_FOOTNOTE_KEY,
        );
      }

      // backlink to content
      if (
        node.tagName === 'a' &&
        node.properties &&
        node.properties.dataFootnoteBackref === true &&
        node.properties.href != null
      ) {
        node.properties.href = node.properties.href.replace(
          REFERENCE_KEY_FROM_MDX_JS,
          NEW_REFERENCE_KEY,
        );

        node.children[0] = ARROW_UNDO_ICON;
      }
    });
  };
}
