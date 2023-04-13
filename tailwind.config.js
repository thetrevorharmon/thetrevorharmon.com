/** @type {import('tailwindcss').Config} */

const containerSize = '620px';

const defaultColors = require('tailwindcss/colors');

const colors = {
  primary: {
    label: 'primary',
    light: defaultColors['green']['800'],
    dark: '#fa5a5a',
  },
  primaryFocus: {
    label: 'primary-focus',
    light: defaultColors['green']['900'],
    dark: '#f81f1f',
  },
  primaryText: {
    label: 'primary-text',
    light: defaultColors['green']['800'],
    dark: '#f95b5b',
  },
  primaryTextFocus: {
    label: 'primary-text-focus',
    light: defaultColors['green']['700'],
    dark: '#f72020',
  },
  text: {
    label: 'text',
    light: '#444',
    dark: '#ddd',
  },
  textBold: {
    label: 'text-bold',
    light: '#252525',
    dark: '#eee',
  },
  textMuted: {
    label: 'text-muted',
    light: '#767676',
    dark: '#b5b5b5',
  },
  captionBg: {
    label: 'caption-bg',
    light: '#f0f0f0',
    dark: '#111111',
  },
  bodyBg: {
    label: 'body-bg',
    light: '#fff',
    dark: '#2a2a2a',
  },
  imgBorder: {
    label: 'img-border',
    light: '#111111',
    dark: '#f0f0f0',
  },
  accentLine: {
    label: 'accent-line',
    light: '#dddddd',
    dark: '#3f3f3f',
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
      display: ['Gloock', 'Source Serif Pro', 'serif'],
      serif: ['Source Serif Pro', 'serif'],
      sans: [
        "'InterVariable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
      ],
      mono: [
        "'Fira Mono', 'PT Mono', 'Consolas', 'Bitstream Vera Sans Mono', 'Courier New', Courier, monospace",
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
        breakout: '40px',
        'container-base': '25px',
      },
      screens: {
        // this exists to make the code clearer when I use it alongside desktop:
        mobile: '0px',
        desktop: containerSize,
        // giving desktop an "alias" for places where the breakout is considered
        // collapsed vs expanded
        base: '0px',
        collapsed: containerSize,
        expanded: '700px',
        // This is specifically for
        containerWithPadding: '650px',
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
      },
      gridTemplateColumns: {
        // name input | email input | button
        form: '1.6fr 2fr 6.3rem',
      },
    },
  },
  plugins: [],
};
