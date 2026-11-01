import {defineConfig} from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import {satteri} from '@astrojs/markdown-satteri';
import {readingTime} from '@xsynaptic/satteri-reading-time';
import {mermaidMdast, mermaidHast} from '@xingwangzhe/satteri-mermaid';
import {codeLineHighlights} from './src/markdown/code-lines.mjs';
import {betterFootnoteLinks} from './src/markdown/footnotes.mjs';
import {headingLinks} from './src/markdown/headings.mjs';
import {markdownImages} from './src/markdown/images.mjs';
import {externalLinks, internalLinkSlashes} from './src/markdown/links.mjs';
import {
  mermaidCodeFences,
  mermaidNewlines,
  mermaidWrapperClass,
} from './src/markdown/mermaid.mjs';

export default defineConfig({
  site: 'https://thetrevorharmon.com',
  trailingSlash: 'always',
  build: {format: 'directory'},
  image: {
    // Same as the default sharp service, except that gifs are not converted.
    service: {entrypoint: './src/markdown/image-service.mjs'},
  },
  markdown: {
    syntaxHighlight: 'prism',
    // The old site did not convert quotes, dashes or ellipses.
    smartypants: false,
    processor: satteri({
      features: {
        gfm: {footnotes: {label: 'Footnotes', backLabel: 'Back to content'}},
      },
      mdastPlugins: [
        readingTime(),
        mermaidNewlines(),
        mermaidMdast(),
        mermaidCodeFences(),
      ],
      hastPlugins: [
        mermaidHast({
          theme: 'base',
          // Merman scopes its theme CSS with the svg's #id, which beats `.Mermaid .node rect` in
          // Mermaid.scss, so the old blue-node look is set through theme variables instead.
          themeVariables: {
            fontFamily:
              '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: '14px',
            primaryColor: '#3b82f6', // tailwind blue-500
            primaryBorderColor: '#1d4ed8', // blue-700
            primaryTextColor: '#ffffff',
            lineColor: '#78716c', // stone-500
            textColor: '#78716c',
            edgeLabelBackground: '#78716c',
          },
        }),
        mermaidWrapperClass(),
        codeLineHighlights(),
        betterFootnoteLinks(),
        headingLinks(),
        externalLinks(),
        internalLinkSlashes(),
        markdownImages(),
      ],
    }),
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      // /drafts/ is author-only. Archived posts stay in, as on the old site.
      filter: (page) => !page.endsWith('/drafts/'),
    }),
  ],
  vite: {
    // antlr4ts (CommonJS, written for Node) requires `assert`, `util` and `buffer`.
    // Vite externalizes Node builtins for the browser, so alias them to the npm polyfills.
    resolve: {alias: {assert: 'assert', util: 'util', buffer: 'buffer'}},
  },
});
