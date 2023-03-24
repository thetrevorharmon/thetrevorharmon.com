import classnames from 'classnames';
import * as React from 'react';

import {TextStyle} from '../../../../UI-Kit';
import LoadingIcon from './loading.svg';

interface FormButtonProps {
  className?: string;
  children: React.ReactNode;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export const FormButton = ({
  className,
  children,
  isDisabled = false,
  isLoading = false,
}: FormButtonProps) => {
  const classname = classnames([
    'Button',
    'py-0 px-small',
    'leading-[45px] h-[45px]',
    'disabled:opacity-50',
    'disabled:hover:cursor-not-allowed',
    '[&>svg]:w-[40px] [&>svg]:mx-auto',
    className,
  ]);

  return (
    <button
      className={classname}
      type="submit"
      disabled={isDisabled}
      aria-label="Submit Form"
    >
      {isLoading ? (
        <LoadingIcon />
      ) : (
        <TextStyle style="Button">{children}</TextStyle>
      )}
    </button>
  );
};
