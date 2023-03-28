import {GatsbyImage} from 'gatsby-plugin-image';
import React from 'react';
import {Breakout} from '../../UI-Kit';
import {Attribution} from './Attribution';

interface Props {
  mdx: Queries.ArticleQuery['mdx'];
}

export function FeaturedImage({mdx}: Props) {
  if (
    mdx == null ||
    mdx.image == null ||
    mdx.image.source == null ||
    mdx.image.source.childImageSharp == null ||
    mdx.image.source.childImageSharp.gatsbyImageData == null
  ) {
    return null;
  }

  const {
    image: {
      source: {
        childImageSharp: {gatsbyImageData},
      },
      alt,
    },
  } = mdx;

  if (alt == null) {
    throw new Error(
      'You must provide alt text for the featured image with the `alt` key',
    );
  }

  const imageMarkup = (
    <Breakout>
      <GatsbyImage image={gatsbyImageData} alt={alt} />
    </Breakout>
  );

  const attribution = <Attribution mdx={mdx} />;

  if (attribution == null) {
    return imageMarkup;
  }

  return (
    <div className="space-y-tiny">
      {imageMarkup}
      {attribution}
    </div>
  );
}
