import * as React from "react";
import classnames from "classnames";
import { Button } from '../../UI-Kit';

import * as styles from './Tile.module.scss';

interface TileProps {
  item: PortfolioItem;
  className?: string;
}

const Tile: React.SFC<TileProps> = ({item, className}) => {
  const tileStyle = {
    backgroundImage: `url(${item.featureImage.resolutions.src})`
  }

  const classname = classnames(
    styles.Tile,
    className
  )

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
  )
}

Tile.defaultProps = {
  className: undefined
}

export default Tile;
