import * as React from 'react';

import {ContentfulAsset, ContentfulAttribution} from '../../../../types';
import {Attribution, Breakout, Header, Image, Meta} from '../../../../UI-Kit';
import {PostHeaderProps} from './types';

interface PostHeroImageProps {
  image: ContentfulAsset;
  attribution?: ContentfulAttribution;
}

const PostHeroImage = ({image, attribution}: PostHeroImageProps) => {
  return (
    <>
      <Breakout>
        <Image src={image} />
      </Breakout>
      {attribution && (
        <>
          <Attribution attribution={attribution} />
        </>
      )}
    </>
  );
};

export const PostHeader = ({
  title,
  meta,
  image,
  photoAttribution,
}: PostHeaderProps) => {
  return (
    <div className="my-large">
      {image && (
        <div className="mb-large">
          <PostHeroImage image={image} attribution={photoAttribution} />
        </div>
      )}
      <div className="space-y-tiny">
        <Header rank={1} type="Title">
          {title}
        </Header>
        <Meta {...meta} />
      </div>
    </div>
  );
};
