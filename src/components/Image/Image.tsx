import {GatsbyImage} from 'gatsby-plugin-image';
import React from 'react';

export function Image({src}: {src: Mdx['image']}) {
  if (
    src == null ||
    src.source == null ||
    src.source.childImageSharp == null ||
    src.source.childImageSharp.gatsbyImageData == null
  ) {
    return null;
  }

  const {
    source: {
      childImageSharp: {gatsbyImageData},
    },
    alt,
  } = src;

  if (alt == null) {
    throw new Error(
      'You must provide alt text for the featured image with the `alt` key',
    );
  }

  return <GatsbyImage image={gatsbyImageData} alt={alt} />;
}
