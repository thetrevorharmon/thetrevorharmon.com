import classnames from 'classnames';
import {Link as GatsbyLink} from 'gatsby';
import * as React from 'react';

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  url?: string;
  size?: 'small' | 'regular';
  onClick?(): void;
  disabled?: boolean;
}

export const Button = ({
  className,
  children,
  url,
  onClick,
  size = 'regular',
  disabled = false,
}: ButtonProps) => {
  if (url != null && onClick != null) {
    throw new Error('Cannot use both the url and onClick props');
  }

  if (url == null && onClick == null) {
    throw new Error('Must use either the url or onClick prop');
  }

  if (url != null && disabled) {
    throw new Error('Cannot use disabled on links');
  }

  const classname = classnames([
    className,
    'text-[1rem]',

    'border border-solid',
    'border-primary shadow-md',
    'dark:border-primary-dark dark:shadow-none',
    'font-display',

    !disabled && 'text-primary focus:text-white hover:text-white',
    !disabled &&
      'dark:text-primary-dark dark:focus:text-white dark:hover:text-white',

    'inline-block rounded-md',

    size === 'regular' && 'py-small px-normal leading-[1]',
    size === 'small' && 'py-[0.5rem] px-[0.75rem] leading-[1] text-sm',

    'bg-body-bg dark:bg-body-bg-dark',

    !disabled && 'focus:bg-primary focus:dark:bg-primary-dark',
    !disabled && 'hover:bg-primary hover:dark:bg-primary-dark',

    'transition duration-200',

    // remove underlines when using this with an <a />
    'no-underline',

    // remove default <button /> styling
    'bg-none',

    // cursor specific to state
    !disabled && 'hover:cursor-pointer',
    disabled && 'hover:cursor-not-allowed',

    // disabled states
    disabled && 'border-stone-500 dark:border-stone-500',
    disabled && 'text-stone-500 dark:text-stone-500',
    disabled && 'hover:text-stone-500 hover:dark:text-stone-500',
  ]);

  const linkMarkup = (linkUrl?: string) => {
    if (linkUrl == null) {
      throw new Error('Href must not be null');
    }

    const externalUrlPattern = /^http/;
    const isExternalUrl = externalUrlPattern.test(linkUrl);

    return isExternalUrl ? (
      <a
        className={classname}
        href={linkUrl}
        target={'_blank'}
        rel="noreferrer"
      >
        {children}
      </a>
    ) : (
      <GatsbyLink className={classname} to={linkUrl}>
        {children}
      </GatsbyLink>
    );
  };

  const buttonMarkup = (clickHandler?: () => void) => {
    if (clickHandler == null) {
      throw new Error('You must provide a clickHandler');
    }

    return (
      <button className={classname} onClick={clickHandler} disabled={disabled}>
        {children}
      </button>
    );
  };

  return url ? linkMarkup(url) : buttonMarkup(onClick);
};
