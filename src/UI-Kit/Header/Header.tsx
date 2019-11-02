import classnames from 'classnames';
import React from 'react';
import * as styles from './Header.module.scss';
import {Theme} from '../../utils/Theme';

export type HeaderRank = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type HeaderType = 'Display' | 'Title' | 'Heading' | 'Subheading';

interface HeaderProps {
  theme: Theme;
  rank: HeaderRank;
  type: HeaderType;
  className?: string;
  children: React.ReactNode;
}

const Header = ({theme, rank, type, className, children}: HeaderProps) => {
  const classname = classnames(styles[`Header-${theme}`], className);

  console.log(`Header-${theme}`);

  const Tag = rank < 1 || rank > 6 ? 'span' : `h${rank}`;

  return <Tag className={classname}>{children}</Tag>;
};

export default Header;
