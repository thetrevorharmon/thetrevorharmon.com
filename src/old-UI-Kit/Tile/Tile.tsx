import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {Button, Image} from '../../old-UI-Kit';
import {Routes} from '../../utils';
import * as styles from './Tile.module.scss';

interface TileProps {
  item: PortfolioItem;
  className?: string;
}

const Tile: React.FC<TileProps> = ({item, className}) => {
  const theme = useTheme();
  const classname = classnames(styles.Tile, styles[`Tile-${theme}`], className);

  return (
    <div className={classname}>
      <Button className={styles.Button} href={Routes.project(item.slug)}>
        View
      </Button>
      <Image className={styles.BackgroundImg} src={item.featureImage} />
    </div>
  );
};

Tile.defaultProps = {};

export default Tile;
