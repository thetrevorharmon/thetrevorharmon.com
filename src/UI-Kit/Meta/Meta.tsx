import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {Icon} from '../../UI-Kit';
import * as styles from './Meta.module.scss';
import {MetaProps} from './types';

export const Meta = ({
  className,
  date,
  isLinkPost = false,
  timeToRead,
  client,
}: MetaProps) => {
  const theme = useTheme();
  const classname = classnames(className, styles[`Meta-${theme}`]);

  const timeToReadPhrase = timeToRead
    ? `${Math.floor(+timeToRead)} min read`
    : undefined;

  const meta = [date, timeToReadPhrase, client].filter(Boolean).join(' / ');
  const icon = isLinkPost ? (
    <Icon name="link" size="small" className={styles.Icon} />
  ) : null;

  return meta ? (
    <p className={classname}>
      {meta}
      {icon}
    </p>
  ) : null;
};
