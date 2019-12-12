import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {ProjectPartial} from '../../types';
import {Header, Image, Link, Meta, Spacer} from '../../UI-Kit';
import {Routes} from '../../utils';
import * as styles from './ProjectPreviewTile.module.scss';

interface ProjectPreviewTileProps {
  project: ProjectPartial;
  className?: string;
}

export const ProjectPreviewTile = ({
  project,
  className,
}: ProjectPreviewTileProps) => {
  const {title, slug, featureImage, projectCompletionDate} = project;
  const theme = useTheme();
  const classname = classnames(
    styles[`ProjectPreviewTile-${theme}`],
    className,
  );

  const textMarkup = (
    <Spacer size="tiny">
      <Header rank={2} type="Heading">
        {title}
      </Header>
      <Meta date={projectCompletionDate} />
    </Spacer>
  );

  return (
    <div className={classname}>
      <Spacer size="normal">
        <Spacer size="normal">
          {/* TODO: fix types */}
          {featureImage && <Image src={featureImage} />}
          {textMarkup}
        </Spacer>
        <Link url={Routes.project(slug)}>See More →</Link>
      </Spacer>
    </div>
  );
};
