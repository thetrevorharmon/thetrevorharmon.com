import React from 'react';

import * as styles from './Container.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({children}: ContainerProps) => {
  return <div className={styles.Container}>{children}</div>;
};
