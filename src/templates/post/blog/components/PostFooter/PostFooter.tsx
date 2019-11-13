import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../../../../context/ThemeContext';
import {Link} from '../../../../../UI-Kit';
import {Routes} from '../../../../../utils';
import * as styles from './PostFooter.module.scss';

interface PostFooterProps {
  olderPost?: BasicPost;
  newerPost?: BasicPost;
}

type PostNavigationDirection = 'Older' | 'Newer';

const PostFooter: React.FC<PostFooterProps> = (props: PostFooterProps) => {
  const theme = useTheme();
  const {olderPost, newerPost} = props;

  const makeNavigation = (
    post: BasicPost,
    direction: PostNavigationDirection,
  ) => {
    const {title, slug} = post;

    return (
      <div className={classnames(styles.Navigation, 'col-lg-6')}>
        Read {direction.toLowerCase()}:<br />
        <Link
          href={Routes.blogPost(slug)}
          className={classnames(styles.Link, styles[direction])}
        >
          <span className={styles.Title}>{title}</span>
        </Link>
      </div>
    );
  };

  return (
    <div className={(styles[`PostFooter-${theme}`], styles.PostFooter)}>
      <div className="row">
        {olderPost && makeNavigation(olderPost, 'Older')}
        {newerPost && makeNavigation(newerPost, 'Newer')}
      </div>
    </div>
  );
};

export {PostFooter};
