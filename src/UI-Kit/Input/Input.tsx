import classnames from 'classnames';
import React from 'react';

import {TextStyle} from '../../UI-Kit';

interface InputProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  isFullWidth?: boolean;
  isValid?: boolean;
  onChange(value: string): void;
}

export const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  isFullWidth = false,
  isValid = true,
}: InputProps) => {
  const id = `${label}-${name}`.replace(/\s/g, '');
  const inputClassName = classnames([
    'Input',
    isFullWidth && 'w-full',
    !isValid && 'text-primary-text dark:text-primary-text-dark',
  ]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange != null) {
      onChange(event.target.value);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="space-y-tiny">
        <label htmlFor={id} className="text-text dark:text-text-dark">
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
      </div>
    </div>
  );
};
