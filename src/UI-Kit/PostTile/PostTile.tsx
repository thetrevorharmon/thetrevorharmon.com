import classnames from 'classnames';
import * as React from 'react';

import {LinkHeader, Meta} from '../../UI-Kit';

import {Routes} from '../../utils';

import * as styles from './PostTile.module.scss';

interface PostTileProps {
  post: BlogPost | LinkPost;
  className?: string;
}

const PostTile: React.FC<PostTileProps> = ({post, className}) => {
  const classname = classnames(styles.PostTile, className);

  return (
    <>
      <div className={classname}>
        <LinkHeader
          type="Subtitle"
          rank={3}
          hasLinkIcon={post.postType === 'Link'}
          href={Routes.blogPost(post.slug)}
          className="mt-0"
        >
          {post.title}
        </LinkHeader>

        <p className={styles.Description}>
          {post.description || post.body.childMarkdownRemark.excerpt || ''}
        </p>
        <Meta post={post} />
      </div>
    </>
  );
};

PostTile.defaultProps = {};

export default PostTile;
