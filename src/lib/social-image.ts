import {getImage} from 'astro:assets';
import {siteData} from '../utils';

/**
 * The absolute URL of a post's featured image for og:image, or undefined when
 * it has none. It keeps the source format (the old site linked the jpg, not
 * the webp) at 800px wide.
 */
export async function getSocialImageUrl(
  source: ImageMetadata | undefined,
): Promise<string | undefined> {
  if (source == null) return undefined;
  const image = await getImage({
    src: source,
    width: Math.min(800, source.width),
    format: source.format,
  });
  return `${siteData.siteUrl}${image.src}`;
}
