import classnames from 'classnames';
import React from 'react';

import {ContentfulAttribution} from '../../types';
import {Link} from '../../UI-Kit';

interface AttributionProps {
  attribution: ContentfulAttribution;
}

export const Attribution = ({
  attribution: {type, author, sourceLocation, sourceName},
}: AttributionProps) => {
  if (type === 'Photo' && author == null) {
    throw new Error('Must provide an author if using a Photo type');
  }

  const styles = {
    Photo: 'Attribution-Photo',
    Article: 'Attribution-Article',
  };

  const classname = classnames('Attribution', styles[type]);

  const photoAttribution = (
    <div className={classname}>
      {`${type} by ${author} on `}
      <Link url={sourceLocation} isMuted>
        {sourceName}
      </Link>
      .
    </div>
  );

  const articleAttribution = (
    <span className={classname}>
      This {`${type.toLowerCase()} was originally published on `}
      <Link url={sourceLocation} isMuted>
        {sourceName}
      </Link>
      .
    </span>
  );

  return type === 'Photo' ? photoAttribution : articleAttribution;
};
