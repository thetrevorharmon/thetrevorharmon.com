import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import {Callout} from '../Callout';
import {TwoUp} from '../TwoUp';
import {Link} from '../Link';
import {Citation} from '../Citation';

interface Props {
  children: React.ReactNode;
}

const shortcodes = {Callout, TwoUp, Link, Citation};

export function MdxProvider({children}: Props) {
  return <MDXProvider components={shortcodes}>{children}</MDXProvider>;
}
