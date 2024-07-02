import {visit} from 'unist-util-visit';

const FOOTNOTE_KEY_FROM_MDX_JS = `user-content-fn-`;
const REFERENCE_KEY_FROM_MDX_JS = `user-content-fnref-`;

const NEW_FOOTNOTE_KEY = 'footnote--';
const NEW_REFERENCE_KEY = 'reference--';

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
      }
    });
  };
}
