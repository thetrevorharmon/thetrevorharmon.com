import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import * as React from 'react';

interface ImageProps {
  className?: string;
  // TODO: get the actual type working here
  src?: any;
}

export const Image = ({className, src}: ImageProps) => {
  const image = getImage(src);

  return image ? (
    <GatsbyImage
      className={className}
      image={image}
      alt={src.title || src.description}
    />
  ) : null;
};
