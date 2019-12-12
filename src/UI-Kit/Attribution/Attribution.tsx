import classnames from 'classnames';
import React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {ContentfulAttribution} from '../../types/Contentful';
import {Link} from '../../UI-Kit';
import * as styles from './Attribution.module.scss';

interface AttributionProps {
  attribution: ContentfulAttribution;
}

export const Attribution = ({
  attribution: {type, author, sourceLocation, sourceName},
}: AttributionProps) => {
  if (type === 'Photo' && author == null) {
    throw new Error('Must provide an author if using a Photo type');
  }

  const theme = useTheme();
  const classname = classnames(
    styles[`Attribution-${theme}`],
    styles[`Attribution-${type}`],
  );

  const photoAttribution = (
    <div className={classname}>
      {`${type} by ${author} on `}
      <Link href={sourceLocation} isMuted>
        {sourceName}
      </Link>
      .
    </div>
  );

  const articleAttribution = (
    <span className={classname}>
      This {`${type.toLowerCase()} was originally published on `}
      <Link href={sourceLocation} isMuted>
        {sourceName}
      </Link>
      .
    </span>
  );

  return type === 'Photo' ? photoAttribution : articleAttribution;
};
