import classnames from 'classnames';
import * as React from 'react';
import Link from '../Link';

import * as styles from './Header.module.scss';

type HeaderRank = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type HeaderType = 'Headline' | 'Tagline' | 'Subtitle' | 'Title';

interface HeaderProps {
  rank: HeaderRank;
  type: HeaderType;
  className?: string;
}

const Header: React.SFC<HeaderProps> = ({rank, type, className, children}) => {

  const classname = classnames(
    styles.Header,
    styles[`${type}`],
    className,
  );

  const Tag = (rank < 1 || rank > 6) ? 'span' : `h${rank}`;

  return (
    <Tag
      className={classname}
    >
      {children}
    </Tag>
  );
};

Header.defaultProps = {
  rank: 2,
  type: 'Title',
};

export default Header;
