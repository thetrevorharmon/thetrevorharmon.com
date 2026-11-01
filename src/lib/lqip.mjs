// A tiny blurred stand-in for an image (what gatsby-plugin-image called
// "blurred" placeholders): the image at 16px wide as a quality-25 WebP,
// inlined as a data URI (about 100-250 bytes). The browser scales it up with
// smoothing, which is the blur. Returns null for images that should not get
// one: animated or non-raster files, and images with transparency (the
// placeholder would show through the finished image).
import sharp from 'sharp';

const WIDTH = 16;
const cache = new Map();

export function lqip(fsPath) {
  if (!fsPath || /\.(gif|svg)$/i.test(fsPath)) return Promise.resolve(null);
  if (!cache.has(fsPath))
    cache.set(
      fsPath,
      make(fsPath).catch(() => null),
    );
  return cache.get(fsPath);
}

async function make(fsPath) {
  const image = sharp(fsPath);
  // `hasAlpha` is true for any RGBA png; isOpaque looks at the pixels.
  if ((await image.metadata()).hasAlpha && !(await image.stats()).isOpaque)
    return null;
  const buffer = await image
    .rotate()
    .resize({width: WIDTH})
    .webp({quality: 25, effort: 6})
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString('base64')}`;
}

// The CSS declaration for an element that shows the placeholder behind itself.
export const lqipBackground = (uri) =>
  `background:url(${uri}) center/cover no-repeat`;
