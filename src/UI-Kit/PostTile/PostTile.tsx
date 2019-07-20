import classnames from 'classnames';
import * as React from 'react';

import {
  Header,
  Link,
} from '../../UI-Kit';

import { Routes } from '../../utils';

import * as styles from './PostTile.module.scss';

interface PostTileProps {
  item: BlogPost | LinkPost;
  className?: string;
}

const PostTile: React.SFC<PostTileProps> = ({item, className}) => {

  const classname = classnames(
    styles.PostTile,
    className,
  );

  const timeToRead = item.body.childMarkdownRemark.timeToRead
    ? `${Math.floor(+item.body.childMarkdownRemark.timeToRead)} min read`
    : undefined;

  const meta = [
    timeToRead,
    item.date,
  ].filter(Boolean).join(' • ');

  return (
    <Link
      className={classname}
      noLinkStyling={true}
      href={Routes.blogPost(item.slug)}
      target="_blank"
    >
      <Header
        rank={3}
        type="Subtitle"
        className={classnames(
          styles.Header,
          'mt-0',
        )}
      >
        {item.title}
      </Header>

      <p>{item.description || item.body.childMarkdownRemark.excerpt || ''}</p>
      <span className={styles.Meta}>
        {meta}
      </span>
    </Link>
  );
};

PostTile.defaultProps = {};

export default PostTile;
