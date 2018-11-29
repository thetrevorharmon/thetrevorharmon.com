import classnames from 'classnames';
import Img from 'gatsby-image';
import * as React from 'react';

import { Button } from '../../UI-Kit';

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
        href={`/${item.slug}`}
      >
        View
      </Button>
      <Img className={styles.BackgroundImg} fluid={item.featureImage.fluid} />
    </div>
  );
};

Tile.defaultProps = {
  className: undefined,
};

export default Tile;
