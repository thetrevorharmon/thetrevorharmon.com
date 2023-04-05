import classnames from 'classnames';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Breakout = ({children, className}: Props) => {
  return <div className={classnames('Breakout', className)}>{children}</div>;
};
