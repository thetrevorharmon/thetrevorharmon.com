import classnames from 'classnames';
import * as React from 'react';

import {
  Header,
  Link,
} from '../../UI-Kit';

import { Routes } from '../../utils';

import * as styles from './PostTile.module.scss';

interface PostTileProps {
  item: BlogPost;
  className?: string;
}

const PostTile: React.SFC<PostTileProps> = ({item, className}) => {

  const classname = classnames(
    styles.PostTile,
    className,
  );

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

      <p>{item.description || ''}</p>
      <span className={styles.Meta}>
        {Math.floor(+item.body.childMarkdownRemark.timeToRead)} min read • {item.date}
      </span>
    </Link>
  );
};

PostTile.defaultProps = {};

export default PostTile;
