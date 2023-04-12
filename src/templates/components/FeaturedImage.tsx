import React from 'react';
import {Image} from '../../components';
import {Attribution} from './Attribution';

interface Props {
  mdx: Mdx;
}

export function FeaturedImage({mdx}: Props) {
  const image = <Image src={mdx?.image} />;

  if (image == null) {
    return null;
  }

  const imageMarkup = (
    <div className="Breakout shadow-[0_1px_6px_rgba(0,0,0,0.5)] rounded-md overflow-hidden">
      {image}
    </div>
  );

  const attribution = <Attribution mdx={mdx} />;

  // if (attribution == null) {
  return imageMarkup;
  // }

  return (
    <div className="space-y-tiny">
      {imageMarkup}
      {attribution}
    </div>
  );
}
