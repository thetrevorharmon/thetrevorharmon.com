import classnames from 'classnames';
import React from 'react';

interface BreakoutProps {
  children: React.ReactNode;
}

export const Breakout = ({children}: BreakoutProps) => {
  return <div className={classnames('Breakout')}>{children}</div>;
};
