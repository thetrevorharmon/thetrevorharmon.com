import React from 'react';

import * as styles from './Breakout.module.scss';

interface BreakoutProps {
  children: React.ReactNode;
}

export const Breakout = ({children}: BreakoutProps) => {
  return <div className={styles.Breakout}>{children}</div>;
};
