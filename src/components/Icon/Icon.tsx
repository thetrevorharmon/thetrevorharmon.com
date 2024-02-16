import classnames from 'classnames';
import * as React from 'react';

import link from './icons/link.svg';
import rss from './icons/rss.svg';
import twitter from './icons/twitter.svg';
import email from './icons/email.svg';
import x from './icons/x.svg';
import play from './icons/play.svg';
import loading from './icons/loading.svg';
import circle from './icons/circle.svg';

import './Icon.scss';

const mapping = {
  link,
  rss,
  twitter,
  email,
  x,
  play,
  loading,
  circle,
};

export type IconName = keyof typeof mapping;

interface IconProps {
  className?: string;
  name: IconName;
  size: 'small' | 'normal' | 'large';
}

const sizes = {
  small: 'Icon-Small',
  normal: 'Icon-Normal',
  large: 'Icon-Large',
};

// const colors = {
//   text: 'Icon-Text',
//   primary: 'Icon-Primary',
// };

export const Icon = ({className, name, size}: IconProps) => {
  if (!(name in mapping)) {
    throw new Error('Icon name not found!');
  }

  const classname = classnames('Icon', sizes[size], className);

  const Tag = mapping[name];

  return (
    <span className={classname}>
      <Tag />
    </span>
  );
};
