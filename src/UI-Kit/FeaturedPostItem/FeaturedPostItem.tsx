import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {BlogPost, isBlogPost, Project} from '../../types';
import {Breakout, Icon, Image, PostItem, Spacer} from '../../UI-Kit';
import * as styles from './FeaturedPostItem.module.scss';

interface FeaturedPostItemProps {
  post: Project | BlogPost;
  className?: string;
}

export const FeaturedPostItem = ({post, className}: FeaturedPostItemProps) => {
  const image = isBlogPost(post) ? post.heroImage : post.featureImage;
  const theme = useTheme();
  const classname = classnames([
    styles.FeaturedPostItem,
    styles[`FeaturedPostItem-${theme}`],
    className,
  ]);

  return (
    <Breakout>
      <div className={classname}>
        <Spacer size="medium">
          <Image src={image} />
          <PostItem post={post} />
        </Spacer>
        <Icon name="star" size="large" className={styles.Icon} />
      </div>
    </Breakout>
  );
};
