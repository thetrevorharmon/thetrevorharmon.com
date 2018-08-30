import * as React from "react";
import classnames from "classnames";
import { Button } from '../../UI-Kit';

import * as styles from './Tile.module.scss';

interface TileProps {
  project: Project;
  className?: string;
}

const Tile: React.SFC<TileProps> = ({project, className}) => {
  const tileStyle = {
    backgroundImage: `url(${project.photos[0].resolutions.src})`
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
        href={`/${project.slug}`}
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
