import classnames from 'classnames';
import * as React from 'react';

import {Image, Link, Meta} from '../../UI-Kit';
import {Routes} from '../../utils';

interface Props {
  project: Mdx;
  className?: string;
}

export const ProjectTile = ({project, className}: Props) => {
  const {title, slug, image, date} = project;
  const classname = classnames(
    'p-normal bg-caption-bg dark:bg-caption-bg-dark',
    'flex flex-col',
    'space-y-normal',
    className,
  );

  return (
    <div className={classname}>
      <div className="space-y-normal">
        {image && <Image src={image} />}
        <div className="space-y-tiny">
          <h2>
            {title}
          </h2>
          <Meta date={date} />
        </div>
      </div>
      <Link url={Routes.project(slug!)}>See More →</Link>
    </div>
  );
};
