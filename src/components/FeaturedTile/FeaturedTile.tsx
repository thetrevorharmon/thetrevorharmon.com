import classnames from 'classnames';
import React from 'react';

import {PostTile} from '../PostTile';
import {Icon, Image} from '../../components';

interface Props {
  node: Mdx;
  className?: string;
}

export const FeaturedTile = ({node, className}: Props) => {
  const classname = classnames([
    // 'bg-caption-bg dark:bg-caption-bg-dark',
    'overflow-hidden',
    'bg-gradient-to-r from-caption-bg-dark via-caption-bg-dark to-caption-bg-dark/50',
    'relative px-container-base desktop:px-big py-large',
    className,
  ]);

  return (
    <div className="Breakout relative rounded-md overflow-hidden shadow-md">
      <div className="absolute -right-[20%] h-100 top-0 bottom-0 max-h-full">
        <Image src={node.image} />
      </div>
      <div className={classname}>
        <div className="space-y-medium">
          <PostTile node={node} />
        </div>
      </div>
    </div>
  );
};
