import classnames from 'classnames';
import * as React from 'react';

import {ProjectPartial} from '../../types';
import {Header, Image, Link, Meta} from '../../UI-Kit';
import {Routes} from '../../utils';

interface ProjectPreviewTileProps {
  project: ProjectPartial;
  className?: string;
}

export const ProjectPreviewTile = ({
  project,
  className,
}: ProjectPreviewTileProps) => {
  const {title, slug, featureImage, projectCompletionDate} = project;
  const classname = classnames(
    'p-normal bg-caption-bg dark:bg-caption-bg-dark',
    'flex flex-col',
    'space-y-normal',
    className,
  );

  return (
    <div className={classname}>
      <div className="space-y-normal">
        {featureImage && <Image src={featureImage} />}
        <div className="space-y-tiny">
          <Header rank={2} type="Heading">
            {title}
          </Header>
          <Meta date={projectCompletionDate} />
        </div>
      </div>
      <Link url={Routes.project(slug)}>See More →</Link>
    </div>
  );
};
