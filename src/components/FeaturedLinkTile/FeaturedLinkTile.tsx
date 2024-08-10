import classnames from 'classnames';
import React from 'react';

import {Icon} from '../../components';

import {Link} from '../../components';
import {Routes} from '../../utils';

interface Props {
  node: Mdx;
  className?: string;
}

export const FeaturedLinkTile = ({node, className}: Props) => {
  const classname = classnames([
    'overflow-hidden',
    'py-medium md:py-big',
    'px-normal sm:px-medium md:px-breakout',

    'rounded-md',
    'border border-solid',
    'bg-gradient-to-r',

    'border-stone-700 dark:border-stone-500',

    // background gradient for light mode
    'from-stone-800/80 to-stone-600/80',

    // background gradient for light mode
    'dark:from-stone-600/50 dark:to-stone-500/10',
    className,
  ]);

  return (
    <div className="Breakout rounded-md overflow-hidden shadow-md dark:shadow-none isolate">
      <div className={classname}>
        <div className="space-y-little">
          <div className="space-y-little">
            <h2 className="text-text-bold-dark inline-flex gap-little items-center">
              {node.title}
              <Icon name="link" size="large" />
            </h2>
            <p className="text-text-bold-dark whitespace-nowrap overflow-hidden text-ellipsis">
              {node.excerpt}
            </p>
          </div>

          <Link
            url={Routes.blogPost(node.slug!)}
            className="block text-primary-text-dark hover:text-primary-text-focus-dark focus:text-primary-text-focus-dark"
            icon={{name: 'arrowRight', position: 'trailing'}}
          >
            Continue Reading
          </Link>
        </div>
      </div>
    </div>
  );
};
