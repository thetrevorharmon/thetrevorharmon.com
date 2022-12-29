import classnames from 'classnames';
import * as React from 'react';

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

const styles = {
  Display: 'Header-Display',
  Title: 'Header-Title',
  Heading: 'Header-Heading',
  Subheading: 'Header-Subheading',
};

export const Header = ({rank, type, className, children}: HeaderProps) => {
  const classname = classnames(styles[type], className);

  const Tag = getTag(rank);
  const internalMarkup =
    type === 'Display' || type === 'Title' ? <span>{children}</span> : children;

  return <Tag className={classname}>{internalMarkup}</Tag>;
};
