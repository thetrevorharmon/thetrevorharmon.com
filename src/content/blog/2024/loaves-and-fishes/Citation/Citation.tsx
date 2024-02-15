import React from 'react';
import classNames from 'classnames';

interface Props {
  children: React.ReactNode;
}

export function Citation({children}: Props) {
  const citationClassName = classNames(
    'bg-stone-200 dark:bg-stone-800',
    'p-normal',
    '[&>p]:mt-tiny [&>p]:mb-small',
    '[&>p>strong]:mr-tiny',
    '[&>p:first-child]:mt-0 [&>p:last-child]:mb-0',
    '[&>p:last-child]:justify-end [&>p:last-child>a+a]:ml-tiny',
    'rounded-md',
  );

  return <div className={citationClassName}>{children}</div>;
}
