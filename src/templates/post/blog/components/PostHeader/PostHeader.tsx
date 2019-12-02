import * as React from 'react';

import {
  Attribution,
  Breakout,
  Header,
  Meta,
  Space,
  Spacer,
} from '../../../../../new-UI-Kit';
import {Image} from '../../../../../old-UI-Kit';

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

interface PostHeaderProps {
  post: BlogPost | LinkPost;
}

export const PostHeader = ({post}: PostHeaderProps) => {
  return (
    <Spacer>
      {post.postType === 'Blog' && post.heroImage && (
        <PostHeroImage
          image={post.heroImage}
          attribution={post.photoAttribution}
        />
      )}

      <Space size="large" />
      <Header rank={1} type="Title">
        {post.title}
      </Header>

      <Space size="tiny" />
      <Meta
        // TODO: Add link header icon
        timeToRead={post.body.childMarkdownRemark.timeToRead}
        date={post.date}
      />
    </Spacer>
  );
};
