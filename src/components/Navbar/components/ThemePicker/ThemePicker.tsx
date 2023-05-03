import classnames from 'classnames';
import React from 'react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import {
  useThemeSetting,
  useSetThemeSetting,
  useUpdateThemeEffect,
} from '../../../../context/ThemeContext';

import {Moon, Sun, Lighting, System} from './icons';

interface Props {
  className?: string;
}

export const ThemePicker = ({className}: Props) => {
  useUpdateThemeEffect();

  const theme = useThemeSetting();
  const setTheme = useSetThemeSetting();

  const buttonClassName = classnames([
    className,
    `bg-none p-0 border-0 hover:cursor-pointer`,
    // color the icon to the primary color
    'text-primary-text dark:text-primary-text-dark',
    // set color on hover/focus
    'hover:text-primary-text-focus hover:dark:text-primary-text-focus-dark',
    'focus:text-primary-text-focus focus:dark:text-primary-text-focus-dark',
  ]);

  const iconClassName = classnames([
    'relative',
    'block',
    'w-[1.25rem]',
  ]);

  const menuItemClassName = classnames([
    'flex items-center w-full',
    'leading-[15px]',
    '[&>svg]:w-[15px] [&>svg]:h-[15px] [&>svg]:mr-little',

    'px-little py-little',

    'hover:cursor-pointer',

    'hover:bg-caption-bg hover:text-text',
    'focus:bg-caption-bg focus:text-text',

    'hover:dark:bg-caption-bg-dark hover:dark:text-text-dark',
    'focus:dark:bg-caption-bg-dark focus:dark:text-text-dark',

    'hover:outline-none focus:outline-none',
  ]);

  const activeMenuItemClassName = classnames([
    'bg-primary-text dark:bg-primary-text-dark',
    'text-stone-200 dark:text-text-muted',

    'hover:bg-primary-text hover:text-white',
    'focus:bg-primary-text focus:text-white',

    'hover:dark:bg-primary-text-dark hover:dark:text-white',
    'focus:dark:bg-primary-text-dark focus:dark:text-white',
  ]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild aria-label="Change Theme">
        <button className={buttonClassName}>
          <span className={iconClassName}>
            <Lighting />
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={classnames([
            'bg-body-bg dark:bg-body-bg-dark',
            'border border-caption-border dark:border-caption-border-dark',
            'rounded-md text-sm',
          ])}
          align="end"
        >
          <DropdownMenu.Item
            className={classnames([
              menuItemClassName,
              theme === 'light' && activeMenuItemClassName,
              'rounded-t-md',
            ])}
            onClick={() => setTheme('light')}
            aria-label="Change theme to light mode"
          >
            <Sun /> Light
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={classnames([
              menuItemClassName,
              theme === 'dark' && activeMenuItemClassName,
            ])}
            onClick={() => setTheme('dark')}
            aria-label="Change theme to dark mode"
          >
            <Moon /> Dark
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={classnames([
              menuItemClassName,
              theme === 'system' && activeMenuItemClassName,
              'rounded-b-md',
            ])}
            onClick={() => setTheme('system')}
            aria-label="Change theme to follow system setting"
          >
            <System /> System
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
