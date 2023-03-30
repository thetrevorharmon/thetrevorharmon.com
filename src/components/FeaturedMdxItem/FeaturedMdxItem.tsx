import classnames from 'classnames';
import React from 'react';

import {PostMdxItem} from '../PostMdxItem';
import {Breakout, Icon, Image} from '../../UI-Kit';

interface Props {
  node: Mdx;
  className?: string;
}

export const FeaturedMdxItem = ({node, className}: Props) => {
  const classname = classnames([
    'bg-caption-bg dark:bg-caption-bg-dark',
    'relative p-container-base desktop:p-big',
    className,
  ]);

  return (
    <Breakout>
      <div className={classname}>
        <div className="space-y-medium">
          <Image src={node.image} />
          <PostMdxItem node={node} />
        </div>
        <Icon
          name="star"
          size="large"
          className={classnames(
            'absolute',
            'right-container-base bottom-container-base',
            'desktop:right-big desktop:bottom-big',
          )}
          color="primary"
        />
      </div>
    </Breakout>
  );
};
