import classnames from 'classnames';
import * as React from 'react';

import {
  Header,
  Link,
} from '../../UI-Kit';

import * as styles from './PostTile.module.scss';

interface PostTileProps {
  item: MediumPost;
  className?: string;
}

const PostTile: React.SFC<PostTileProps> = ({item, className}) => {

  const classname = classnames(
    styles.PostTile,
    className,
  );

  const baseUrl = 'http://medium.com/@thetrevorharmon/';

  return (
    <Link
      className={classname}
      noLinkStyling={true}
      href={baseUrl + item.uniqueSlug}
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

      <p>{item.virtuals.metaDescription || item.virtuals.subtitle}</p>
      <span className={styles.Meta}>{Math.floor(item.virtuals.readingTime)} min read • {item.firstPublishedAt}</span>
    </Link>
  );
};

PostTile.defaultProps = {
  className: undefined,
};

export default PostTile;
