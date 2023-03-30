import React from 'react';
import {Breakout, Image} from '../../UI-Kit';
import {Attribution} from './Attribution';

interface Props {
  mdx: Mdx;
}

export function FeaturedImage({mdx}: Props) {
  const image = <Image src={mdx?.image} />;

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
