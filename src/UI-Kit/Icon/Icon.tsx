import classnames from 'classnames';
import * as React from 'react';

import {expand, link, rss, star, twitter} from './icons';
import {IconName} from './types';

interface IconProps {
  className?: string;
  name: IconName;
  size: 'small' | 'normal' | 'large';
  color?: 'text' | 'primary';
}

// Disabling object-literal-shorthand because otherwise
// I can't have a 'dynamic' icon name that works
/* tslint:disable object-literal-shorthand */
const mapping: {[name in IconName]: React.SVGFactory} = {
  expand: expand,
  link: link,
  rss: rss,
  star: star,
  twitter: twitter,
};

const sizes = {
  small: 'Icon-Small',
  normal: 'Icon-Normal',
  large: 'Icon-Large',
};

const colors = {
  text: 'Icon-Text',
  primary: 'Icon-Primary',
};

export const Icon = ({className, name, color = 'text', size}: IconProps) => {
  if (!(name in mapping)) {
    throw new Error('Icon name not found!');
  }

  const classname = classnames('Icon', sizes[size], colors[color], className);

  const Tag = mapping[name];

  return (
    <span className={classname}>
      <Tag />
    </span>
  );
};
