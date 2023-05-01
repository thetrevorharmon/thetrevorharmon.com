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
    <div className="Breakout shadow-sm rounded-md overflow-hidden">{image}</div>
  );

  const caption = mdx.image?.title ?? <Attribution mdx={mdx} /> ?? null;

  if (caption == null) {
    return imageMarkup;
  }

  return (
    <div className="space-y-little">
      {imageMarkup}
      <div className="Caption">{caption}</div>
    </div>
  );
}
