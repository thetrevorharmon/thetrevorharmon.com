// Inline React versions of the theme icons. Astro's Vite build imports .svg as a URL,
// not a component, so these replace the old gatsby-plugin-react-svg imports.
import React from 'react';

const Moon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeWidth="2"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeMiterlimit="10"
  >
    <path d="M21.46,16.54A10.51,10.51,0,1,1,12,1.49a10.34,10.34,0,0,1,2.8.38,8.12,8.12,0,0,0,2.45,15.86A8,8,0,0,0,21.46,16.54Z" />
  </svg>
);

const Sun = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeWidth="2"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeMiterlimit="10"
  >
    <line x1="12" y1="0.5" x2="12" y2="2.42" /><line x1="12" y1="21.58" x2="12" y2="23.5" /><line x1="23.5" y1="12" x2="21.58" y2="12" /><line x1="2.42" y1="12" x2="0.5" y2="12" /><line x1="12" y1="0.5" x2="12" y2="2.42" /><line x1="12" y1="21.58" x2="12" y2="23.5" /><line x1="23.5" y1="12" x2="21.58" y2="12" /><line x1="2.42" y1="12" x2="0.5" y2="12" /><line x1="20.13" y1="3.87" x2="18.78" y2="5.22" /><line x1="5.22" y1="18.78" x2="3.87" y2="20.13" /><line x1="20.13" y1="20.13" x2="18.78" y2="18.78" /><line x1="5.22" y1="5.22" x2="3.87" y2="3.87" /><line x1="20.13" y1="3.87" x2="18.78" y2="5.22" /><line x1="5.22" y1="18.78" x2="3.87" y2="20.13" /><line x1="20.13" y1="20.13" x2="18.78" y2="18.78" /><line x1="5.22" y1="5.22" x2="3.87" y2="3.87" /><circle cx="12" cy="12" r="6.71" />
  </svg>
);

const Lighting = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeWidth="2"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeMiterlimit="10"
  >
    <g><circle cx="11.99" cy="12.01" r="6.71" /><path d="M12,8.65a3.36,3.36,0,0,1,0,6.72Z" /><line x1="11.99" y1="0.5" x2="11.99" y2="2.42" /><line x1="11.99" y1="21.6" x2="11.99" y2="23.52" /><line x1="0.48" y1="12.01" x2="2.4" y2="12.01" /><line x1="21.58" y1="12.01" x2="23.5" y2="12.01" /><line x1="20.13" y1="3.87" x2="18.77" y2="5.23" /><line x1="5.21" y1="18.79" x2="3.85" y2="20.15" /><line x1="3.85" y1="3.87" x2="5.21" y2="5.23" /><line x1="18.77" y1="18.79" x2="20.13" y2="20.15" /></g>
  </svg>
);

const System = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeWidth="2"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeMiterlimit="10"
  >
    <line x1="8.18" y1="22.5" x2="9.14" y2="17.73" /><line x1="5.32" y1="22.5" x2="18.68" y2="22.5" /><rect x="1.5" y="1.5" width="21" height="16.23" rx="1.91" /><line x1="15.75" y1="22.5" x2="14.8" y2="17.73" /><line x1="1.5" y1="13.91" x2="22.5" y2="13.91" />
  </svg>
);

export {Moon, Sun, Lighting, System};
