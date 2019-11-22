import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import * as styles from './Header.module.scss';
import {HeaderRank, HeaderType} from './types';

interface HeaderProps {
  rank: HeaderRank;
  type: HeaderType;
  className?: string;
  children: React.ReactNode;
}

const getTag = (rank: HeaderRank): keyof JSX.IntrinsicElements => {
  const mapping: {[headerRank in HeaderRank]: keyof JSX.IntrinsicElements} = {
    0: 'span',
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  };

  return mapping[rank];
};

export const Header = ({rank, type, className, children}: HeaderProps) => {
  const theme = useTheme();
  const classname = classnames(
    styles.Header,
    styles[`Header-${theme}`],
    styles[`Header-${type}`],
    className,
  );

  const Tag = getTag(rank);
  const internalMarkup =
    type === 'Display' || type === 'Title' ? <span>{children}</span> : children;

  return <Tag className={classname}>{internalMarkup}</Tag>;
};
