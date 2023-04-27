import React from 'react';
import classNames from 'classnames';

interface Props {
  children: React.ReactNode;
}

export function Callout({children}: Props) {
  const className = classNames(
    'border-blue-300 bg-blue-100/50',
    'dark:border-blue-500 dark:bg-blue-900/20',
    'border-l-4 pl-[calc(theme(space.small)_+_4px)] py-small [&>p]:my-0 mr-tiny pr-small',
    'italic',
  );

  return <div className={className}>{children}</div>;
}
