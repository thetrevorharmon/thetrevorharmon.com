import classnames from 'classnames';
import Img, {FluidObject} from 'gatsby-image';
import * as React from 'react';

// TODO: manage these types better bc this sucks
type ContentfulObjectType =
  | 'ContentfulBlogPost'
  | 'ContentfulLinkPost'
  | 'ContentfulProject'
  | 'ContentfulAboutPage';

interface BaseObject {
  internal?: {
    content?: string;
    contentDigest?: string;
    description?: string;
    fieldOwners?: string;
    ignoreType?: string;
    mediaType?: string;
    owner?: string;
    type?: ContentfulObjectType;
  };
}

interface ContentfulAsset extends BaseObject {
  id?: string;
  title: string;
  description: string;
  fluid: FluidObject;
}

interface ImageProps {
  className?: string;
  src?: ContentfulAsset;
}

export const Image = ({className, src}: ImageProps) => {
  return src ? (
    <Img
      className={className}
      fluid={src.fluid}
      alt={`${src.title} | ${src.description}`}
    />
  ) : null;
};
