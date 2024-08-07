import classnames from 'classnames';
import React from 'react';

import {Image} from '../../components';

import {Link} from '../../components';
import {Routes} from '../../utils';

interface Props {
  node: Mdx;
  className?: string;
}

export const FeaturedTile = ({node, className}: Props) => {
  const classname = classnames([
    'overflow-hidden relative rounded-md',
    'bg-gradient-to-r from-caption-bg-dark to-caption-bg-dark/50',
    'py-medium md:py-large',
    'px-normal sm:px-medium md:px-breakout',
    className,
  ]);

  const buttonText = node?.type === 'Project' ? 'See More' : 'Continue Reading';

  const route = node?.type === 'Project' ? Routes.project : Routes.blogPost;

  return (
    <div className="Breakout relative rounded-md overflow-hidden shadow-md dark:shadow-none isolate">
      <div className="absolute -left-[20%] -right-[20%] sm:left-0 sm:right-0  h-100 bottom-0 max-h-full">
        <Image src={node.image} />
      </div>
      <div className={classname}>
        <div className="space-y-normal">
          <div className="space-y-small">
            <div className="space-y-tiny">
              <h2 className="text-text-bold-dark sm:max-w-[85%] md:max-w-[70%]">
                {node.title}
              </h2>
            </div>
            <p className="text-text-dark max-w-[70%]">{node.description}</p>
          </div>

          <Link
            url={route(node.slug!)}
            className="block text-primary-text-dark hover:text-primary-text-focus-dark focus:text-primary-text-focus-dark"
            icon={{name: 'arrowRight', position: 'trailing'}}
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};
