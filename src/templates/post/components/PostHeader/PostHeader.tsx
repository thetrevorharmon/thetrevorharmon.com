import * as React from 'react';

import {
  Attribution,
  Breakout,
  Header,
  Image,
  Meta,
  MetaProps,
  Space,
  Spacer,
} from '../../../../UI-Kit';
import {PostHeaderProps} from './types';

interface PostHeroImageProps {
  image: ContentfulAsset;
  attribution?: ContentfulAttribution;
}

const PostHeroImage = ({image, attribution}: PostHeroImageProps) => {
  return (
    <>
      <Space size="medium" />
      <Breakout>
        <Image src={image} />
      </Breakout>
      {attribution && (
        <>
          <Space size="tiny" />
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
    <Spacer>
      {image && <PostHeroImage image={image} attribution={photoAttribution} />}
      <Space size="large" />
      <Header rank={1} type="Title">
        {title}
      </Header>
      <Space size="tiny" />
      <Meta {...meta} />
      <Space size="large" />
    </Spacer>
  );
};
