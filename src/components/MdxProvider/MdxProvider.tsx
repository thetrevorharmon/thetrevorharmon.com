import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import {Callout} from '../Callout';
import {TwoUp} from '../TwoUp';
import {Link} from '../Link';
import {Citation} from '../Citation';
import {Breakout} from '../Breakout';
import {Carousel} from '../Carousel';

interface Props {
  children: React.ReactNode;
}

const shortcodes = {
  Callout,
  TwoUp,
  Link,
  Citation,
  Breakout,
  Carousel,
};

export function MdxProvider({children}: Props) {
  return <MDXProvider components={shortcodes}>{children}</MDXProvider>;
}
