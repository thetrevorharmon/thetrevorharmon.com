import React from 'react';
import {Breakout, ImageNext} from '../../UI-Kit';
import {Attribution} from './Attribution';

interface Props {
  mdx: Mdx;
}

export function FeaturedImage({mdx}: Props) {
  const image = <ImageNext src={mdx?.image} />;

  if (image == null) {
    return null;
  }

  const imageMarkup = <Breakout>{image}</Breakout>;

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
