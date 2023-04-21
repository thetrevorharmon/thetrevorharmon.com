import * as React from 'react';

import {Link} from '../../components';
import {Routes} from '../../utils';

export interface Props {
  node: Mdx;
  className?: string;
}

export const PostTile = ({node}: Props) => {
  if (node.slug == null) {
    return null;
  }

  return (
    <div>
      <Link
        url={Routes.blogPost(node.slug)}
        icon={
          node.link
            ? {
                position: 'trailing',
                name: 'link',
              }
            : undefined
        }
      >
        {node.title}
      </Link>
      <div className="text-text-muted dark:text-text-muted-dark">
        {node.date}
      </div>
    </div>
  );
};
