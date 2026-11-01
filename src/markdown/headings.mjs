// Heading links, as the old gatsby-remark-autolink-headers produced them:
//   <h2 id="x" style="position:relative">
//     <a href="#x" aria-label="X permalink" class="header-link before"><span><svg/></span></a>X
//   </h2>
// Only h2 to h5, and never the screen-reader-only "Footnotes" heading.
import {satteriAutolinkHeadings} from 'satteri-autolink-headings';
import {satteriSlug} from 'satteri-slug';

const CLS = 'cls-6374f8d9b67f094e4896c620-1';
const el = (tagName, properties, children = []) => ({
  type: 'element',
  tagName,
  properties,
  children,
});

// Same icon as src/components/Icon/icons/link.svg, as hast elements (a `raw`
// replacement does not compile in MDX).
const linkIcon = () =>
  el('span', {}, [
    el(
      'svg',
      {
        id: 'Layer_1',
        'data-name': 'Layer 1',
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        'stroke-width': '2',
        width: '24',
        height: '24',
      },
      [
        el('defs', {}, [
          el('style', {}, [
            {
              type: 'text',
              value: `.${CLS}{fill:none;stroke:currentColor;stroke-miterlimit:10;}`,
            },
          ]),
        ]),
        el('path', {
          className: [CLS],
          d: 'M9.14,7.23A4.76,4.76,0,0,1,13,5.32h4.78a4.77,4.77,0,1,1,0,9.54H13a4.77,4.77,0,0,1-4.67-3.81',
        }),
        el('path', {
          className: [CLS],
          d: 'M15.72,13a4.77,4.77,0,0,0-4.67-3.81H6.27a4.77,4.77,0,0,0,0,9.54h4.78a4.76,4.76,0,0,0,3.37-1.39,3.57,3.57,0,0,0,.44-.52',
        }),
      ],
    ),
  ]);

const isScreenReaderOnly = (heading) => {
  const cls = heading.properties?.className;
  return Array.isArray(cls) ? cls.includes('sr-only') : cls === 'sr-only';
};

/** Gives every heading an id, then the permalink icon. Order matters. */
export function headingLinks() {
  const autolink = satteriAutolinkHeadings({
    behavior: 'prepend',
    test: ['h2', 'h3', 'h4', 'h5'],
    content: () => linkIcon(),
    properties: (heading) => ({
      ariaLabel: `${String(heading.properties?.id ?? '').replace(/-/g, ' ')} permalink`,
      className: ['header-link', 'before'],
    }),
    headingProperties: {style: 'position:relative'},
  });
  const visit = autolink.element.visit;
  autolink.element.visit = (heading, ctx) =>
    isScreenReaderOnly(heading) ? undefined : visit(heading, ctx);
  return [satteriSlug(), autolink];
}
