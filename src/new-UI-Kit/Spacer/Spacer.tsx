import classnames from 'classnames';
import React from 'react';

import * as styles from './Spacer.module.scss';

type Size =
  | 'tiny'
  | 'little'
  | 'small'
  | 'normal'
  | 'medium'
  | 'big'
  | 'large'
  | 'huge';

interface SpacerProps {
  size: Size;
  children: React.ReactNode;
}

export const Spacer = ({size, children}: SpacerProps) => {
  const wrapNode = (node: React.ReactNode, index: number = 0) => {
    const className = classnames([styles.Item, styles[`Item-${size}`]]);
    return (
      <div className={className} key={index}>
        {node}
      </div>
    );
  };

  const wrappedChildren = Array.isArray(children)
    ? children.map(wrapNode)
    : wrapNode(children);

  return <>{wrappedChildren}</>;
};
