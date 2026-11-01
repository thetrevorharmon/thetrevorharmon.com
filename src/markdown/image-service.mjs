// Astro's sharp image service, with two changes:
//  - gifs pass through untouched. Sharp would turn them into a still (or a
//    different format); a gif that is asked for as a gif (`format: 'gif'`, set
//    in images.mjs) is copied as is, so it keeps animating.
//  - `data-widths="200,400,800"` (set in images.mjs, because a hast property
//    can't hold a list) becomes the `widths` option, so the image gets a srcset.
//  - WebP/JPEG quality defaults to 50 (sharp's default is 80). The old site used
//    gatsby-plugin-image's default of 50, and at 80 the same pages were about
//    50% heavier (Phase 9). An explicit `quality` on an image still wins.
import sharpService from 'astro/assets/services/sharp';

const DEFAULT_QUALITY = 50;

const widthsOf = (options) =>
  options['data-widths']
    ? String(options['data-widths']).split(',').map(Number)
    : undefined;

export default {
  ...sharpService,
  async validateOptions(options, ...rest) {
    const widths = widthsOf(options);
    if (widths) options = {...options, widths};
    return sharpService.validateOptions(options, ...rest);
  },
  getHTMLAttributes(options, ...rest) {
    const {['data-widths']: _widths, ...attributes} = options;
    return sharpService.getHTMLAttributes(attributes, ...rest);
  },
  async transform(inputBuffer, transform, ...rest) {
    if (transform.format === 'gif') return {data: inputBuffer, format: 'gif'};
    return sharpService.transform(
      inputBuffer,
      {...transform, quality: transform.quality ?? DEFAULT_QUALITY},
      ...rest,
    );
  },
};
