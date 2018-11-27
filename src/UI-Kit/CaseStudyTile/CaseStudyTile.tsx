import classnames from 'classnames';
import * as React from 'react';

import { Link, Header } from '../../UI-Kit';

import * as styles from './CaseStudyTile.module.scss';

interface CaseStudyTileProps {
  item: CaseStudy;
  className?: string;
}

const CaseStudyTile: React.SFC<CaseStudyTileProps> = ({item, className}) => {
  const caseStudyTileStyle = {
    backgroundImage: `url(${item.featureImage.resolutions.src})`,
  };

  const classname = classnames(
    styles.CaseStudyTile,
    'd-flex flex-row',
    className,
  );

  return (
    <div
      className={classname}
    >
      <div className="d-flex flex-column">
        <Header rank={3} type="Title" className={classnames(
          styles.TileTitle,
          'mt-0 mb-0',
        )}>
          {item.title}
        </Header>
        <p className="pr-3 mt-2 mt-sm-0">{item.tagline}</p>
        <Link
          className={styles.Link}
          href={`/${item.slug}`}
        >
          Read Case Study
        </Link>
      </div>
      <div className={styles.TileImg} style={caseStudyTileStyle} />
    </div>
  );
};

CaseStudyTile.defaultProps = {
  className: undefined,
};

export default CaseStudyTile;
