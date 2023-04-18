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
        'text-primary dark:text-primary-dark',
        // 'text-white hover:text-white active:text-white focus:text-white',
        // 'dark:text-white dark:hover:text-white dark:active:text-white dark:focus:text-white',
        // 'bg-primary dark:bg-primary-dark',
        'hover:text-white focus:text-white',
        'dark:hover:text-white dark:focus:text-white',
        'hover:bg-primary dark:hover:bg-primary-dark',
        'focus:bg-primary dark:focus:bg-primary-dark',
        'text-[1.92rem] desktop:text-[2.4rem]',
        '-tracking-[0.5px] desktop:-tracking-[1px]',
        'font-display',
        // 'font-black',
        'uppercase',
        // 'italic',
        'border-2',
        'border-stone-300 dark:border-stone-600',
        'hover:border-primary dark:hover:border-primary-dark',
        'focus:border-primary dark:focus:border-primary-dark',
        'rounded-xl',
        'focus:outline-none',
        'transition-colors',
      )}
    >
      th.
    </Link>
  );
};
