import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {BlogItem, Breakout, Image, Spacer} from '../../UI-Kit';
import * as styles from './FeaturedItem.module.scss';

interface FeaturedItemProps {
  post: BlogPost;
  className?: string;
}

export const FeaturedItem = ({post, className}: FeaturedItemProps) => {
  const theme = useTheme();
  const classname = classnames([styles[`FeaturedItem-${theme}`], className]);

  return (
    // TODO: add star to bottom right corner
    <Breakout>
      <div className={classname}>
        <Spacer size="medium">
          <Image src={post.heroImage} />
          <BlogItem post={post} />
        </Spacer>
      </div>
    </Breakout>
  );
};
