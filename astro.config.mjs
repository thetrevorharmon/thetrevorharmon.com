import {defineConfig} from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://thetrevorharmon.com',
  trailingSlash: 'always',
  build: {format: 'directory'},
  markdown: {
    syntaxHighlight: 'prism',
  },
  integrations: [react(), mdx(), sitemap()],
  vite: {
    // antlr4ts (CommonJS, written for Node) requires `assert`, `util` and `buffer`.
    // Vite externalizes Node builtins for the browser, so alias them to the npm polyfills.
    resolve: {alias: {assert: 'assert', util: 'util', buffer: 'buffer'}},
  },
});
