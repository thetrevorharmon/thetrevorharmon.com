import classnames from 'classnames';
import React, {useContext} from 'react';
import * as styles from './Header.module.scss';
import {Theme} from '../../utils/Theme';
import {ThemeContext} from '../../context/ThemeContext';

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
  const {dark} = useContext(ThemeContext);
  const themeIs: Theme = dark ? Theme.Light : Theme.Dark;
  const classname = classnames(styles[`Header-${themeIs}`], className);

  console.log(`Header-${themeIs}`);

  const Tag = rank < 1 || rank > 6 ? 'span' : `h${rank}`;

  return <Tag className={classname}>{children}</Tag>;
};

export default Header;
