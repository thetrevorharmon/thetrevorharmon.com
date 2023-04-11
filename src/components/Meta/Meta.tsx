import classnames from 'classnames';
import * as React from 'react';

import {Icon} from '../Icon';

export interface MetaProps {
  className?: string;
  date?: string | null;
  isLinkPost?: boolean;
  timeToRead?: number | null;
  client?: string | null;
}

export const Meta = ({
  className,
  date,
  isLinkPost = false,
  timeToRead: timeToReadMinutes,
  client,
}: MetaProps) => {
  const classname = classnames(
    className,
    'text-[0.86666667rem]',
    'uppercase tracking-[3px]',
    'block',
    'text-text-muted dark:text-text-muted-dark',
    'fill-text-muted dark:fill-text-muted-dark',
  );

  const timeToRead = timeToReadMinutes ? `${timeToReadMinutes} min read` : null;

  const meta = [date, timeToRead, client].filter(Boolean).join(' / ');
  const icon = isLinkPost ? (
    <Icon
      name="link"
      size="small"
      color="primary"
      className="top-[3px] ml-tiny relative inline-block"
    />
  ) : null;

  return meta ? (
    <p className={classname}>
      {meta}
      {icon}
    </p>
  ) : null;
};
