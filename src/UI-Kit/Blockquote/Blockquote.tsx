import classnames from 'classnames';
import * as React from 'react';

import {Breakout} from '../Breakout';

interface BlockquoteProps {
  children: React.ReactNode;
  className?: string;
}

export const Blockquote = ({children, className}: BlockquoteProps) => {
  const classname = classnames(className, 'Blockquote');

  return (
    <Breakout>
      <blockquote className={classname}>{children}</blockquote>
    </Breakout>
  );
};
