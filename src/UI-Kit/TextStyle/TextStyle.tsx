import classnames from 'classnames';
import * as React from 'react';

import * as styles from './TextStyle.module.scss';
import {TextStyle as TextStyleOption} from './types';

interface TextStyleProps {
  children: React.ReactNode;
  style: TextStyleOption;
}

export const TextStyle = ({children, style}: TextStyleProps) => {
  const classname = classnames(styles.TextStyle, styles[`TextStyle-${style}`]);

  return <span className={classname}>{children}</span>;
};
