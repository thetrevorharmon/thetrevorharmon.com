import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {Icon} from '../../UI-Kit';
import * as styles from './Meta.module.scss';

interface MetaProps {
  className?: string;
  date?: Date;
  isLinkPost?: boolean;
  timeToRead?: string;
}

export const Meta = ({
  className,
  date,
  isLinkPost = false,
  timeToRead,
}: MetaProps) => {
  const theme = useTheme();
  const classname = classnames(className, styles[`Meta-${theme}`]);

  const timeToReadPhrase = timeToRead
    ? `${Math.floor(+timeToRead)} min read`
    : undefined;

  const meta = [date, timeToReadPhrase].filter(Boolean).join(' / ');
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
