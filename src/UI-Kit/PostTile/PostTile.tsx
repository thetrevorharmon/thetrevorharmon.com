import classnames from 'classnames';
import * as React from 'react';

import { Button } from '../../UI-Kit';

import * as styles from './PostTile.module.scss';

interface PostTileProps {
  item: PortfolioItem;
  className?: string;
}

const PostTile: React.SFC<PostTileProps> = ({item, className}) => {
  const tileStyle = {
    backgroundImage: `url(${item.featureImage.resolutions.src})`,
  };

  const classname = classnames(
    styles.PostTile,
    className,
  );

  return (
    <div
      className={classname}
      style={tileStyle}
    >
      <Button
        className={styles.Button}
        href={`/${item.slug}`}
      >
        View
      </Button>
    </div>
  );
};

PostTile.defaultProps = {
  className: undefined,
};

export default PostTile;
