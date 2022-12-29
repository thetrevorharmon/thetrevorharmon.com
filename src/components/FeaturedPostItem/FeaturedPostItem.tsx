import classnames from 'classnames';
import * as React from 'react';

import {PostItem} from '../../components';
import {BlogPost, isBlogPost, Project} from '../../types';
import {Breakout, Icon, Image} from '../../UI-Kit';

interface FeaturedPostItemProps {
  post: Project | BlogPost;
  className?: string;
}

export const FeaturedPostItem = ({post, className}: FeaturedPostItemProps) => {
  const image = isBlogPost(post) ? post.heroImage : post.featureImage;
  const classname = classnames([
    'bg-caption-bg dark:bg-caption-bg-dark',
    'relative p-container-base desktop:p-big',
    className,
  ]);

  return (
    <Breakout>
      <div className={classname}>
        <div className="space-y-medium">
          <Image src={image} />
          <PostItem post={post} />
        </div>
        <Icon
          name="star"
          size="large"
          className={classnames(
            'absolute',
            'right-container-base bottom-container-base',
            'desktop:right-big desktop:bottom-big',
          )}
          color="primary"
        />
      </div>
    </Breakout>
  );
};
