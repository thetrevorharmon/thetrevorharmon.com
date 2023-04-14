import * as React from 'react';

import {Link, Meta} from '../../components';
import {Routes} from '../../utils';

export interface Props {
  node: Mdx;
  className?: string;
}

export const PostTile = ({node}: Props) => {
  const buttonText =
    node?.type === 'Project' ? 'See More →' : 'Continue Reading →';

  const route = node?.type === 'Project' ? Routes.project : Routes.blogPost;

  return (
    <div className="space-y-normal">
      <div className="space-y-small">
        <div className="space-y-tiny">
          <h2 className='text-text-bold-dark'>{node.title}</h2>
          <Meta
            date={node.date}
            timeToRead={node.timeToRead}
            isLinkPost={node.link != null}
            className='text-text-muted-dark'
          />
        </div>
        <p className='text-text-dark'>{node.description}</p>
      </div>

      <Link url={route(node.slug!)} className="block text-primary-text-dark hover:text-primary-text-focus-dark focus:text-primary-text-focus-dark">
        {buttonText}
      </Link>
    </div>
  );
};
