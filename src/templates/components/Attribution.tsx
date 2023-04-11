import classnames from 'classnames';
import React from 'react';

import {Link} from '../../components';

interface AttributionProps {
  mdx: Mdx;
}

export const Attribution = ({mdx}: AttributionProps) => {
  if (
    mdx == null ||
    mdx.image == null ||
    mdx.image.attribution == null ||
    mdx.image.attribution.author == null ||
    mdx.image.attribution.sourceUrl == null ||
    mdx.image.attribution.sourceName == null ||
    (mdx.image.attribution.sourceName !== 'Unsplash' &&
      mdx.image.attribution.sourceName !== 'Medium')
  ) {
    return null;
  }

  const {
    image: {
      attribution: {author, sourceUrl, sourceName},
    },
  } = mdx;

  const classname = classnames(
    'text-text-muted dark:text-text-dark',
    'text-[0.86666667rem]',
    'mt-tiny text-center',
  );

  return (
    <div className={classname}>
      {`Photo by ${author} on `}
      <Link url={sourceUrl} isMuted>
        {sourceName}
      </Link>
      .
    </div>
  );
};
