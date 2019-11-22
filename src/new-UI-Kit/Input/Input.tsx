import classnames from 'classnames';
import React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {Spacer, TextStyle} from '../../new-UI-Kit';
import * as styles from './Input.module.scss';

interface InputProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  isFullWidth?: boolean;
  onChange(value: string): void;
}

export const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  isFullWidth = false,
}: InputProps) => {
  const theme = useTheme();
  const id = `${label}-${name}`.replace(/\s/g, '');
  const inputClassName = classnames([
    styles[`Input-${theme}`],
    isFullWidth && styles.FullWidth,
  ]);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange != null) {
      onChange(event.target.value);
    }
  };

  // TODO: determine form validation and need for props here
  return (
    <Spacer size="tiny">
      <label htmlFor={id} className={styles[`Label-${theme}`]}>
        <TextStyle style="Label">{label}</TextStyle>
      </label>
      <input
        id={id}
        name={name}
        type="text"
        placeholder={placeholder}
        className={inputClassName}
        value={value}
        onChange={handleChange}
      />
    </Spacer>
  );
};
