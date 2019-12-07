import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import * as styles from './Blockquote.module.scss';

interface BlockquoteProps {
  children: React.ReactNode;
  className?: string;
}

export const Blockquote = ({children, className}: BlockquoteProps) => {
  const theme = useTheme();
  const classname = classnames(className, styles[`Blockquote-${theme}`]);

  return <blockquote className={classname}>{children}</blockquote>;
};
