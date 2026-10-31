import classnames from 'classnames';
import * as React from 'react';

// The SVG files are imported as raw strings (`?raw`) and inlined, so an icon is
// plain markup. That works the same in an Astro component and in a React
// island, and the SVGs stay editable files. (Vite imports a plain `.svg` as a
// URL, not a component, so the old SVGR approach does not apply.)
import link from './icons/link.svg?raw';
import rss from './icons/rss.svg?raw';
import xLogo from './icons/x-logo.svg?raw';
import email from './icons/email.svg?raw';
import x from './icons/x.svg?raw';
import play from './icons/play.svg?raw';
import loading from './icons/loading.svg?raw';
import circle from './icons/circle.svg?raw';
import arrowRight from './icons/arrow-right.svg?raw';
import arrowReturn from './icons/arrow-return.svg?raw';

import './Icon.scss';

// Drop the XML prolog some exported files carry, which is invalid inside HTML.
const clean = (svg: string) => svg.replace(/^<\?xml[^>]*\?>/, '').trim();

const mapping = {
  link: clean(link),
  rss: clean(rss),
  xLogo: clean(xLogo),
  email: clean(email),
  x: clean(x),
  play: clean(play),
  loading: clean(loading),
  circle: clean(circle),
  arrowRight: clean(arrowRight),
  arrowReturn: clean(arrowReturn),
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

export const Icon = ({className, name, size}: IconProps) => {
  if (!(name in mapping)) {
    throw new Error('Icon name not found!');
  }

  const classname = classnames('Icon', sizes[size], className);

  return (
    <span className={classname} dangerouslySetInnerHTML={{__html: mapping[name]}} />
  );
};
