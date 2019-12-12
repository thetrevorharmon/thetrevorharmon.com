import {FluidObject} from 'gatsby-image';

export type ContentfulObjectType =
  | 'ContentfulBlogPost'
  | 'ContentfulLinkPost'
  | 'ContentfulProject'
  | 'ContentfulAboutPage'
  | 'ContentfulAsset'
  | 'ContentfulAttribution';

export interface ContentfulBaseObject {
  internal: {
    content?: string;
    contentDigest?: string;
    description?: string;
    fieldOwners?: string;
    ignoreType?: string;
    mediaType?: string;
    owner?: string;
    type: ContentfulObjectType;
  };
}

export function getContentfulObjectType(
  element: any,
): ContentfulObjectType | null {
  if (element && element.internal && element.internal.type) {
    return element.internal.type as ContentfulObjectType;
  }
  return null;
}

export interface ContentfulAsset extends ContentfulBaseObject {
  id?: string;
  title: string;
  description: string;
  fluid: FluidObject | FluidObject[];
}

export function getContentfulAssetSrc(asset: ContentfulAsset) {
  const fluid = asset.fluid instanceof Array ? asset.fluid[0] : asset.fluid;
  return fluid.src;
}

type ContentfulAttributionType = 'Photo' | 'Article';
type ContentfulAttributionSource = 'Unsplash' | 'Medium';

export interface ContentfulAttribution extends ContentfulBaseObject {
  name: string;
  sourceLocation: string;
  sourceName: ContentfulAttributionSource;
  author: string;
  type: ContentfulAttributionType;
}

export interface ContentfulLongText extends ContentfulBaseObject {
  childMarkdownRemark: MarkdownRemark;
}

export function isContentfulElementOfType(
  element: any,
  type: ContentfulObjectType,
) {
  return (
    element.internal && (element as ContentfulBaseObject).internal.type === type
  );
}
