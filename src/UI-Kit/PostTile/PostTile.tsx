import classnames from 'classnames';
import * as React from 'react';

import {
  Header,
  Link,
  LinkHeader,
} from '../../UI-Kit';

import { Routes } from '../../utils';

import * as styles from './PostTile.module.scss';

interface PostTileProps {
  post: BlogPost | LinkPost;
  className?: string;
}

const PostTile: React.SFC<PostTileProps> = ({post, className}) => {

  const classname = classnames(
    styles.PostTile,
    className,
  );

  const timeToRead = post.body.childMarkdownRemark.timeToRead
    ? `${Math.floor(+post.body.childMarkdownRemark.timeToRead)} min read`
    : undefined;

  const meta = [
    timeToRead,
    post.date,
  ].filter(Boolean).join(' • ');

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

      <p>{post.description || post.body.childMarkdownRemark.excerpt || ''}</p>
      <span className={styles.Meta}>
        {meta}
      </span>
    </div>
    </>
  );
};

PostTile.defaultProps = {};

export default PostTile;
