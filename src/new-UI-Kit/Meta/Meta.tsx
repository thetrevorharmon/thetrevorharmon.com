import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import * as styles from './Meta.module.scss';

interface MetaProps {
  timeToRead?: string;
  date?: Date;
  className?: string;
}

export const Meta = ({timeToRead, date, className}: MetaProps) => {
  const theme = useTheme();
  const classname = classnames(className, styles[`Meta-${theme}`]);

  const timeToReadPhrase = timeToRead
    ? `${Math.floor(+timeToRead)} min read`
    : undefined;

  const meta = [date, timeToReadPhrase].filter(Boolean).join(' / ');

  // TODO: add support for link posts (add link icon)
  return meta ? <p className={classname}>{meta}</p> : null;
};
