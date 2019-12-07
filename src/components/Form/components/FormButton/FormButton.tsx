import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../../../context/ThemeContext';
import {TextStyle} from '../../../../UI-Kit';
import * as styles from './FormButton.module.scss';
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
  const theme = useTheme();
  const classname = classnames([
    className,
    styles.FormButton,
    styles[`FormButton-${theme}`],
  ]);

  return (
    <button className={classname} type="submit" disabled={isDisabled}>
      {isLoading ? (
        <LoadingIcon />
      ) : (
        <TextStyle style="Button">{children}</TextStyle>
      )}
    </button>
  );
};
