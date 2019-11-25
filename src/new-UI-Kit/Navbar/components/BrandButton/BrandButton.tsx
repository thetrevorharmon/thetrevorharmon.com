import {Link} from 'gatsby';
import React from 'react';

import {useTheme} from '../../../../context/ThemeContext';
import {TextStyle} from '../../../../new-UI-Kit';
import {Routes} from '../../../../utils';
import * as styles from './BrandButton.module.scss';

export const BrandButton = () => {
  const theme = useTheme();
  return (
    <Link to={Routes.home()} className={styles[`Brand-${theme}`]}>
      <TextStyle style="Title">TH.</TextStyle>
    </Link>
  );
};
