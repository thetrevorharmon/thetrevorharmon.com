import classnames from 'classnames';
import {Link} from 'gatsby';
import React from 'react';

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
        'text-[1.92rem] desktop:text-[2.4rem]',
        '-tracking-[0.5px] desktop:-tracking-[1px]',
        'uppercase font-black italic',
      )}
    >
      TH.
    </Link>
  );
};
