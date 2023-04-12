/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import 'normalize.css';
import './src/styles/global.scss';

import React from 'react';
import {ThemeProvider} from './src/context/ThemeContext';
export const wrapRootElement = ({element}) => (
  <ThemeProvider>{element}</ThemeProvider>
);
