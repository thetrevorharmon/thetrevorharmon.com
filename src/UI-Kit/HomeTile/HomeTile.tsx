import classnames from 'classnames';
import * as React from 'react';

import { Link, Header } from '../../UI-Kit';

import * as styles from './HomeTile.module.scss';

interface HomeTileProps {
  item: PortfolioItem;
  className?: string;
}

const HomeTile: React.SFC<HomeTileProps> = ({item, className}) => {
  const homeTileStyle = {
    backgroundImage: `url(${item.featureImage.resolutions.src})`,
  };

  const classname = classnames(
    styles.HomeTile,
    className,
  );

  return (
    <div
      className={classname}
    >
      <Header rank={3} type="Title" className={classnames(
        styles.TileTitle,
        'mt-0',
      )}>
        {item.title}
      </Header>
      <p>{'How I created an app that transferred money in < 15 seconds'}</p>
      <div className={styles.TileImg} style={homeTileStyle} />
      <Link
        className={styles.Button}
        href={`/${item.slug}`}
      >
        Read Case Study
      </Link>
    </div>
  );
};

HomeTile.defaultProps = {
  className: undefined,
};

export default HomeTile;
