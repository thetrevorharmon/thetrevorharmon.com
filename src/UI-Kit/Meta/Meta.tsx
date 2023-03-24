import classnames from 'classnames';
import * as React from 'react';

import {Icon} from '../../UI-Kit';

import {MetaProps} from './types';

export const Meta = ({
  className,
  date,
  isLinkPost = false,
  timeToRead,
  client,
}: MetaProps) => {
  const classname = classnames(className, 'Meta');

  const timeToReadPhrase = timeToRead
    ? `${Math.floor(+timeToRead)} min read`
    : undefined;

  const meta = [date, timeToReadPhrase, client].filter(Boolean).join(' / ');
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
