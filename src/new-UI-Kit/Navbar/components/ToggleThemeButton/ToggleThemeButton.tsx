import classnames from 'classnames';
import React from 'react';

import {
  Theme,
  useTheme,
  useToggleTheme,
} from '../../../../context/ThemeContext';
import {moon, sun} from './icons';
import * as styles from './ToggleThemeButton.module.scss';

interface ToggleThemeButtonProps {
  className?: string;
}

export const ToggleThemeButton = ({className}: ToggleThemeButtonProps) => {
  const theme = useTheme();
  const toggleTheme = useToggleTheme();
  const buttonClassName = classnames([className, styles.Button]);
  const iconClassName = classnames([styles.Icon, styles[`Icon-${theme}`]]);

  const Icon = theme === Theme.Dark ? sun : moon;

  return (
    <span className={styles.Container}>
      <button onClick={toggleTheme} className={buttonClassName}>
        <span className={iconClassName}>
          <Icon />
        </span>
      </button>
    </span>
  );
};
