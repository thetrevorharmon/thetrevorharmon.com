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
        'px-[9px] py-[6px]',
        'leading-none',
        'no-underline',
        'text-primary dark:text-primary-dark',
        'hover:text-white focus:text-white',
        'dark:hover:text-white dark:focus:text-white',
        'hover:bg-primary dark:hover:bg-primary-dark',
        'focus:bg-primary dark:focus:bg-primary-dark',
        'text-[1.6rem] desktop:text-[2rem]',
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
