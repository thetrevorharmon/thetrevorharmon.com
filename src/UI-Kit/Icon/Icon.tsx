import classnames from 'classnames';
import * as React from 'react';

import * as styles from './Icon.module.scss';

import {
  rss,
  twitter,
} from './icons';

interface IconProps {
  className?: string;
  href?: string;
  name: string;
  noStyling?: boolean;
}

// Disabling object-literal-shorthand because otherwise
// I can't have a 'dynamic' icon name that works

/* tslint:disable object-literal-shorthand */
const mapping: { [name: string]: () => any } = {
  rss: rss,
  twitter: twitter,
};

const Icon: React.SFC<IconProps> = ({
  className,
  children,
  href,
  name,
}) => {

  const classname = classnames(
    styles.Icon,
    className,
  );

  if (!(`${name}` in mapping)) {
    throw new Error('Icon name not found!');
  }

  const Tag = mapping[name];

  return Tag ? (
    <span className={classname}>
      <Tag />
    </span>
  ) : null;
};

Icon.defaultProps = {
  href: '',
  noStyling: false,
};

export default Icon;
