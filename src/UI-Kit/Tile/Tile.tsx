import classnames from 'classnames';
import * as React from 'react';

import { Button, Image } from '../../UI-Kit';

import * as styles from './Tile.module.scss';

interface TileProps {
  item: PortfolioItem;
  className?: string;
}

const Tile: React.SFC<TileProps> = ({item, className}) => {

  const classname = classnames(
    styles.Tile,
    className,
  );

  return (
    <div
      className={classname}
    >
      <Button
        className={styles.Button}
        href={`/projects/${item.slug}`}
      >
        View
      </Button>
      <Image className={styles.BackgroundImg} src={item.featureImage} />
    </div>
  );
};

Tile.defaultProps = {
  className: undefined,
};

export default Tile;
