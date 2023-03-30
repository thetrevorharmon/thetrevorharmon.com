import classnames from 'classnames';
import * as React from 'react';

import {Header, ImageNext, Link, MetaNext} from '../../UI-Kit';
import {Routes} from '../../utils';

interface ProjectPreviewTileProps {
  project: Mdx;
  className?: string;
}

export const ProjectPreviewMdxTile = ({
  project,
  className,
}: ProjectPreviewTileProps) => {
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
        {image && <ImageNext src={image} />}
        <div className="space-y-tiny">
          <Header rank={2} type="Heading">
            {title}
          </Header>
          <MetaNext date={date} />
        </div>
      </div>
      <Link url={Routes.projectNext(slug!)}>See More →</Link>
    </div>
  );
};
