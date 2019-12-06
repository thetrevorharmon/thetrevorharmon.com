import classnames from 'classnames';
import React from 'react';
import * as ReactIs from 'react-is';

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
  children: React.ReactNode;
  size?: Size;
}

export const Spacer = ({children, size}: SpacerProps) => {
  const wrapItem = (node: React.ReactNode, index: number) => {
    const className = classnames([styles.Item, size && styles[`Item-${size}`]]);

    // I found this 👇 solution at https://rmolinamir.github.io/typescript-cheatsheet/
    // I'm not totally confident in it, but I think it works for now
    const isSpace =
      React.isValidElement(node) &&
      typeof node.type === 'function' &&
      (node.type as React.FunctionComponent).displayName === Space.name;

    return isSpace ? (
      <React.Fragment key={index}>{node}</React.Fragment>
    ) : (
      <div className={className} key={index}>
        {node}
      </div>
    );
  };

  const wrapChildren = (node: React.ReactNode, index: number) => {
    if (React.isValidElement(node) && ReactIs.isFragment(node)) {
      const wrappedFragment = React.Children.map(node.props.children, wrapItem);
      return <React.Fragment key={index}>{wrappedFragment}</React.Fragment>;
    } else {
      return wrapItem(node, index);
    }
  };

  const wrappedChildren = React.Children.map(children, wrapChildren);
  return <div className={styles.Spacer}>{wrappedChildren}</div>;
};

interface SpaceProps {
  size: Size;
}

export const Space = ({size}: SpaceProps) => {
  return <div className={styles[`Space-${size}`]} />;
};
