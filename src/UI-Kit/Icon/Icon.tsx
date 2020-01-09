import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import * as styles from './Icon.module.scss';
import {expand, link, rss, star, twitter} from './icons';
import {IconName} from './types';

interface IconProps {
  className?: string;
  name: IconName;
  size: 'small' | 'normal' | 'large';
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

export const Icon = ({className, name, size}: IconProps) => {
  if (!(name in mapping)) {
    throw new Error('Icon name not found!');
  }

  const theme = useTheme();
  const classname = classnames(
    styles.Icon,
    styles[`Icon-${theme}`],
    styles[`Icon-${size}`],
    className,
  );

  const Tag = mapping[name];

  return (
    <span className={classname}>
      <Tag />
    </span>
  );
};
