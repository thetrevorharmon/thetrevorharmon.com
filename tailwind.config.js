/** @type {import('tailwindcss').Config} */

const containerSize = '36rem';

const defaultColors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const colors = {
  primary: {
    label: 'primary',
    light: defaultColors['red']['600'],
    dark: defaultColors['red']['400'],
  },
  primaryFocus: {
    label: 'primary-focus',
    light: defaultColors['red']['700'],
    dark: defaultColors['red']['300'],
  },
  primaryText: {
    label: 'primary-text',
    light: defaultColors['red']['600'],
    dark: defaultColors['red']['400'],
  },
  primaryTextFocus: {
    label: 'primary-text-focus',
    light: defaultColors['red']['700'],
    dark: defaultColors['red']['300'],
  },
  text: {
    label: 'text',
    light: defaultColors['stone']['600'],
    dark: defaultColors['stone']['300'],
  },
  textBold: {
    label: 'text-bold',
    light: defaultColors['stone']['800'],
    dark: defaultColors['stone']['200'],
  },
  textMuted: {
    label: 'text-muted',
    light: defaultColors['stone']['500'],
    dark: defaultColors['stone']['500'],
  },
  captionBg: {
    label: 'caption-bg',
    light: defaultColors['stone']['200'],
    dark: defaultColors['stone']['800'],
  },
  captionBorder: {
    label: 'caption-border',
    light: defaultColors['stone']['300'],
    dark: defaultColors['stone']['700'],
  },
  bodyBg: {
    label: 'body-bg',
    light: defaultColors['stone']['50'],
    dark: defaultColors['stone']['800'],
  },
  imgBorder: {
    label: 'img-border',
    light: defaultColors['stone']['800'],
    dark: defaultColors['stone']['200'],
  },
  accentLine: {
    label: 'accent-line',
    light: defaultColors['stone']['300'],
    dark: defaultColors['stone']['700'],
  },
};

const tailwindColors = {};

Object.values(colors).forEach(({label, light, dark}) => {
  tailwindColors[label] = light;
  tailwindColors[`${label}-dark`] = dark;
});

module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/templates/**/*.{js,jsx,ts,tsx}',
    './src/utils/**/*.{js,jsx,ts,tsx}',
    './src/layouts/**/*.{js,jsx,ts,tsx}',
    './src/content/**/*.{js,jsx,ts,tsx}',
    './plugins/**/*.{js,mjs,ts,tsx}',
  ],
  theme: {
    fontFamily: {
      display: ['Montagu Slab', ...defaultTheme.fontFamily.serif],
      serif: ['Source Serif Pro', ...defaultTheme.fontFamily.serif],
      mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
    },
    extend: {
      spacing: {
        tiny: '0.3333rem',
        little: '0.6666rem',
        small: '1rem',
        normal: '1.3333rem',
        medium: '2rem',
        big: '2.66666667rem',
        large: '4rem',
        huge: '6rem',
        breakout: '2.66666667rem',
        container: containerSize,
      },
      width: {
        container: containerSize,
      },
      maxWidth: {
        container: containerSize,
      },
      colors: tailwindColors,
    },
  },
  plugins: [],
};
