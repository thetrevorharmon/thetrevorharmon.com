/** @type {import('tailwindcss').Config} */

const containerSize = '36rem';

const defaultColors = require('tailwindcss/colors');

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
    dark: defaultColors['stone']['400'],
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
  bodyBg: {
    label: 'body-bg',
    light: defaultColors['stone']['50'],
    dark: defaultColors['stone']['900'],
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

Object.values(colors).map(({label, light, dark}) => {
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
  ],
  theme: {
    fontFamily: {
      display: ['Montagu Slab', 'serif'],
      serif: ['Source Serif Pro', 'serif'],
      sans: [
        // 'Figtree',
        "'InterVariable'",
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
      ],
      mono: [
        "'JetBrains Mono', 'Consolas', 'Bitstream Vera Sans Mono', 'Courier New', Courier, monospace",
      ],
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
      boxShadow: {
        'header-display': `14px 0 0 ${colors.primary.light}, -10px 0 0 ${colors.primary.light}`,
        'header-display-dark': `14px 0 0 ${colors.primary.dark}, -10px 0 0 ${colors.primary.dark}`,
        'header-title': `9.8px 0 0 ${colors.primary.light}, -7px 0 0 ${colors.primary.light}`,
        'header-title-dark': `9.8px 0 0 ${colors.primary.dark}, -7px 0 0 ${colors.primary.dark}`,
      },
      backgroundImage: {
        quote: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14px' height='10px' viewBox='0 0 14 10' version='1.1'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M12.9270073,0 L10.8321168,5.24509804 L14,5.24509804 L14,10 L7.86861314,10 L7.86861314,5.68627451 L10.5255474,0 L12.9270073,0 Z M0,10 L0,5.68627451 L2.65693431,0 L5.05839416,0 L2.96350365,5.24509804 L6.08029197,5.24509804 L6.08029197,10 L0,10 Z' id='“' fill='%23EC4242' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E")`,
        'quote-dark': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='14px' height='10px' viewBox='0 0 14 10' version='1.1'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M12.9270073,0 L10.8321168,5.24509804 L14,5.24509804 L14,10 L7.86861314,10 L7.86861314,5.68627451 L10.5255474,0 L12.9270073,0 Z M0,10 L0,5.68627451 L2.65693431,0 L5.05839416,0 L2.96350365,5.24509804 L6.08029197,5.24509804 L6.08029197,10 L0,10 Z' id='“' fill='%23FA5A5A' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E")`,
        'caption-bg-gradient': `linear-gradient(90deg, ${colors.captionBg.light} 45%, rgba(0,0,0,0) 100%)`,
        'caption-bg-gradient-dark': `linear-gradient(90deg, ${colors.captionBg.dark} 45%, rgba(0,0,0,0) 100%)`,
      },
    },
  },
  plugins: [],
};
