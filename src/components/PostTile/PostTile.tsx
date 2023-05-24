import * as React from 'react';

import {Link} from '../../components';
import {Routes} from '../../utils';

export interface Props {
  slug?: string | null;
  title?: string | null;
  date?: string | null;
  type?: string;
  isLinkPost?: boolean;
  className?: string;
}

export const PostTile = ({
  slug,
  title,
  date,
  isLinkPost,
  type = 'Post',
}: Props) => {
  if (slug == null) {
    return null;
  }

  const route = type === 'Post' ? Routes.blogPost : Routes.project;

  return (
    <div>
      <Link
        url={route(slug)}
        icon={
          isLinkPost
            ? {
                position: 'trailing',
                name: 'link',
              }
            : undefined
        }
      >
        {title}
      </Link>
      <div className="text-text-muted dark:text-text-muted-dark">{date}</div>
    </div>
  );
};
