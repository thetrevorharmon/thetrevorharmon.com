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
        'pt-[7px] pr-[9px] pb-[6px] pl-[10px]',
        'leading-none',
        'no-underline',
        'text-primary dark:text-primary-dark',
        'hover:text-white focus:text-white',
        'dark:hover:text-white dark:focus:text-white',
        'hover:bg-primary dark:hover:bg-primary-dark',
        'focus:bg-primary dark:focus:bg-primary-dark',
        'text-[1.6rem] md:text-[2rem]',
        '-tracking-[0.5px] md:-tracking-[1px]',
        'font-display',
        'uppercase',
        'border-2',
        'border-stone-300 dark:border-stone-600',
        'hover:border-primary dark:hover:border-primary-dark',
        'focus:border-primary dark:focus:border-primary-dark',
        'rounded-lg',
        'focus:outline-none',
        'transition-colors',
      )}
    >
      th.
    </Link>
  );
};
