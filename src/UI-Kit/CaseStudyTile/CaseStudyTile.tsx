import classnames from 'classnames';
import Img from 'gatsby-image';
import * as React from 'react';

import {
  Header,
  Link,
} from '../../UI-Kit';

import * as styles from './CaseStudyTile.module.scss';

interface CaseStudyTileProps {
  item: CaseStudy;
  className?: string;
}

const CaseStudyTile: React.SFC<CaseStudyTileProps> = ({item, className}) => {
  const classname = classnames(
    styles.Tile,
    'd-flex flex-row',
    className,
  );

  return (
    <div
      className={classname}
    >
      <div className="d-flex flex-column">
        <Header
          rank={3}
          type="Title"
          className={classnames(
            styles.Title,
            'mt-0 mb-0',
          )}
        >
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
      <Img fluid={item.featureImage.fluid} className={styles.Img} />
    </div>
  );
};

CaseStudyTile.defaultProps = {
  className: undefined,
};

export default CaseStudyTile;
