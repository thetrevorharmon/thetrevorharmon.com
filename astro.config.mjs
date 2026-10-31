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
    // The old site did not convert quotes, dashes or ellipses.
    smartypants: false,
  },
  integrations: [react(), mdx(), sitemap({
      // /drafts/ is author-only. Archived posts stay in, as on the old site.
      filter: (page) => !page.endsWith('/drafts/'),
    })],
  vite: {
    // antlr4ts (CommonJS, written for Node) requires `assert`, `util` and `buffer`.
    // Vite externalizes Node builtins for the browser, so alias them to the npm polyfills.
    resolve: {alias: {assert: 'assert', util: 'util', buffer: 'buffer'}},
  },
});
