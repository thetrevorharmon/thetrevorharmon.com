import * as React from 'react';

import {Link, Meta} from '../../UI-Kit';
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
          <h2>{node.title}</h2>
          <Meta
            date={node.date}
            timeToRead={node.timeToRead}
            isLinkPost={node.link != null}
          />
        </div>
        <p>{node.description}</p>
      </div>

      <Link url={route(node.slug!)} className="block">
        {buttonText}
      </Link>
    </div>
  );
};
