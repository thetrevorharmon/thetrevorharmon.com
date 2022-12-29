import classnames from 'classnames';
import React from 'react';

import {
  Theme,
  useTheme,
  useToggleTheme,
} from '../../../../context/ThemeContext';
import {Moon, Sun} from './icons';

interface ToggleThemeButtonProps {
  className?: string;
}

export const ToggleThemeButton = ({className}: ToggleThemeButtonProps) => {
  const theme = useTheme();
  const toggleTheme = useToggleTheme();
  const buttonClassName = classnames([
    className,
    `bg-none p-0 border-0 hover:cursor-pointer`,
    // color the icon to the primary color
    '[&>*>svg>path]:fill-primary dark:[&>*>svg>path]:fill-primary-dark',
    // set color on hover/focus
    'hover:[&>*>svg>path]:fill-text hover:dark:[&>*>svg>path]:fill-text-dark',
    'focus:[&>*>svg>path]:fill-text focus:dark:[&>*>svg>path]:fill-text-dark',
  ]);

  const iconClassName = classnames([
    'relative',
    'top-[3px]',
    'block',
    'w-[1.25rem]',
  ]);

  const Icon = theme === Theme.Dark ? Sun : Moon;

  return (
    <span className="flex items-center">
      <button
        onClick={toggleTheme}
        className={buttonClassName}
        aria-label="Toggle Theme"
      >
        <span className={iconClassName}>
          <Icon />
        </span>
      </button>
    </span>
  );
};
