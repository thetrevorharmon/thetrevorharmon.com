// Markdown images, in the shape the old gatsby-remark-images gave them:
//  - a paragraph that holds only images becomes the images themselves (no <p>),
//  - an image with a title becomes <figure><img><figcaption>title</figcaption></figure>,
//  - an empty alt falls back to the file name (`My-Photo.png` -> `My Photo`),
//  - the image is shown at most 800px wide (src) with a 200-1600px srcset, never enlarged.
// Astro does the resizing: the props set here (including `data-widths`, for the
// srcset) go to `getImage()` through its `__ASTRO_IMAGE_` marker. Animated gifs are not resized or converted; see
// src/markdown/image-service.mjs.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import probe from 'probe-image-size';
import {defineHastPlugin} from 'satteri';

const MAX_WIDTH = 800;
const SRCSET_WIDTHS = [200, 400, 800, 1600];
const SIZES = '(min-width: 800px) 800px, 100vw';
const isLocal = (src) => !/^([a-z][a-z\d+.-]*:|\/\/|\/)/i.test(src);
// gatsby-remark-images skipped gifs: they lost their <p> but got no wrapper.
const isGif = (img) => /\.gif$/i.test(String(img.properties?.src ?? ''));
const onlyImages = (p) => {
  const content = p.children.filter((child) => !isWhitespace(child));
  return (
    content.length > 0 &&
    content.every((c) => c.type === 'element' && c.tagName === 'img')
  );
};
const isWhitespace = (node) => node.type === 'text' && node.value.trim() === '';

function naturalSize(filePath) {
  try {
    const {width, height, orientation} = probe.sync(fs.readFileSync(filePath));
    // EXIF orientations 5-8 are rotated a quarter turn.
    return orientation >= 5 ? {width: height, height: width} : {width, height};
  } catch {
    return null;
  }
}

function enhance(img, fileURL, {styled}) {
  const props = {...img.properties};
  // A data attribute, because the image marker would also emit `className` as a
  // second, React-style attribute.
  if (styled) props['data-md-image'] = '';
  const src = typeof props.src === 'string' ? props.src : '';
  if (
    !isLocal(src) ||
    fileURL == null ||
    img.properties?.['data-md-image'] != null
  )
    return img;

  const file = path.resolve(
    path.dirname(fileURLToPath(fileURL)),
    decodeURI(src),
  );
  const ext = path.extname(file).toLowerCase();

  if (props.alt == null || props.alt === '') {
    props.alt = path
      .basename(file, path.extname(file))
      .replace(/[^A-Z0-9]/gi, ' ');
  }

  const size = naturalSize(file);
  // Animated gifs are not resized; Astro only needs to know to leave them be.
  if (ext === '.gif') props.format = 'gif';
  if (size != null) {
    const width = Math.min(MAX_WIDTH, size.width);
    if (ext !== '.gif') {
      props.width = width;
      // Same candidates as the old site (200/400/800/1600), so retina screens
      // get a sharp image; `src` is the 800px one. A hast property can't carry
      // a list (it comes out as one joined string, and clobbers `width`), so
      // the widths travel as a string in `data-widths`, and the image service
      // (image-service.mjs) turns them into a srcset.
      const widths = SRCSET_WIDTHS.filter((w) => w <= size.width);
      if (size.width > widths.at(-1) && size.width < SRCSET_WIDTHS.at(-1))
        widths.push(size.width);
      if (widths.length > 1) {
        props['data-widths'] = widths.join(',');
        props.sizes = SIZES;
      }
    }
    // The old image wrapper rounded the height to the nearest half percent of
    // the width. Use the same box so the page lands on the same pixel.
    const percent = Math.round((size.height / size.width) * 200) / 2;
    const box = `aspect-ratio:100/${percent}`;
    // The carousel sizes its photos from this box shape, as the old one did.
    props['data-ratio'] = 100 / percent;
    if (styled) props.style = `max-width:${width}px;${box}`;
    else if (ext !== '.gif') props.style = box;
  }
  return {...img, properties: props};
}

export const markdownImages = () =>
  defineHastPlugin({
    name: 'markdown-images',
    element: [
      {
        // Images that are not alone in a paragraph, like the ones inside
        // `<TwoUp>![a](a.png) ![b](b.png)</TwoUp>`.
        filter: ['img'],
        visit(img, ctx) {
          // Images in a paragraph are handled with the paragraph, below.
          const parent = ctx.parent(img);
          if (parent?.tagName === 'p' && onlyImages(parent)) return;
          const enhanced = enhance(img, ctx.fileURL, {styled: false});
          if (enhanced === img) return;
          for (const [key, value] of Object.entries(enhanced.properties)) {
            if (img.properties?.[key] !== value)
              ctx.setProperty(img, key, value);
          }
        },
      },
      {
        filter: ['p'],
        visit(p, ctx) {
          if (!onlyImages(p)) return;
          const content = p.children.filter((child) => !isWhitespace(child));
          const images = content.map((img) =>
            enhance(img, ctx.fileURL, {styled: !isGif(img)}),
          );
          if (
            images.length === 1 &&
            images[0].properties?.title &&
            !isGif(images[0])
          ) {
            const [img] = images;
            ctx.replaceNode(p, {
              type: 'element',
              tagName: 'figure',
              properties: {className: ['md-figure']},
              children: [
                img,
                {
                  type: 'element',
                  tagName: 'figcaption',
                  properties: {},
                  children: [
                    {type: 'text', value: String(img.properties.title)},
                  ],
                },
              ],
            });
            return;
          }
          ctx.replaceNode(p, images);
        },
      },
    ],
  });
