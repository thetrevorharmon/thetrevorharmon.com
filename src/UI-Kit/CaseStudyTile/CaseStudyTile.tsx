import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {Header, Image, Link} from '../../UI-Kit';
import {Routes} from '../../utils';
import * as styles from './CaseStudyTile.module.scss';

interface CaseStudyTileProps {
  item: CaseStudy;
  className?: string;
}

const CaseStudyTile: React.FC<CaseStudyTileProps> = ({item, className}) => {
  const theme = useTheme();
  const classname = classnames(
    styles.Tile,
    styles[`Tile-${theme}`],
    'd-flex flex-row',
    className,
  );

  return (
    <div className={classname}>
      <div className="d-flex flex-column">
        <Header
          rank={3}
          type="Title"
          className={classnames(styles.Title, 'mt-0 mb-0')}
        >
          {item.title}
        </Header>
        <p className="pr-3 mt-2 mt-sm-0">{item.tagline}</p>
        <Link className={styles.Link} href={Routes.caseStudy(item.slug)}>
          Read Case Study
        </Link>
      </div>
      <Image src={item.featureImage} className={styles.Img} />
    </div>
  );
};

CaseStudyTile.defaultProps = {};

export default CaseStudyTile;
