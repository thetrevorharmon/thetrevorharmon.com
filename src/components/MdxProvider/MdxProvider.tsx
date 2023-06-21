import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import {Callout} from '../Callout';
import {TwoUp} from '../TwoUp';

interface Props {
  children: React.ReactNode;
}

const shortcodes = {Callout, TwoUp};

export function MdxProvider({children}: Props) {
  return <MDXProvider components={shortcodes}>{children}</MDXProvider>;
}
