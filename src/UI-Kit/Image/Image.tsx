import Img from 'gatsby-image';
import * as React from 'react';

import {ContentfulAsset} from '../../types';

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
