import classnames from 'classnames';
import {Link} from 'gatsby';
import React from 'react';

import {TextStyle} from '../../../../UI-Kit';
import {Routes} from '../../../../utils';

export const BrandButton = () => {
  return (
    <Link
      to={Routes.home()}
      className={classnames(
        'inline-block',
        'p-tiny',
        'leading-none',
        'no-underline',
        'text-white',
        'bg-primary dark:bg-primary-dark',
        'hover:bg-primary-focus dark:hover:bg-primary-focus-dark',
      )}
    >
      <TextStyle style="Title">TH.</TextStyle>
    </Link>
  );
};
