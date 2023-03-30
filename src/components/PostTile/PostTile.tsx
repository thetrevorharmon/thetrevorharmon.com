import * as React from 'react';

import {Header, Link, Meta, TextStyle} from '../../UI-Kit';
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
          <Header rank={2} type="Heading">
            {node.title}
          </Header>
          <Meta date={node.date} timeToRead={node.timeToRead} />
        </div>
        <p>
          <TextStyle style="Body">{node.description}</TextStyle>
        </p>
      </div>

      <Link url={route(node.slug!)} className="block">
        {buttonText}
      </Link>
    </div>
  );
};
