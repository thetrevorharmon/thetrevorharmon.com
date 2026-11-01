# Astro migration research

**Status:** research done and the Phase 2 risk spike has passed. The site itself has not been migrated yet. Last updated 2026-10-31.

This is the research on moving this site from Gatsby to Astro, plus the decisions made so far. The original evaluation is in [issue #270](https://github.com/thetrevorharmon/thetrevorharmon.com/issues/270). The wider look at alternatives is in [this comment on #270](https://github.com/thetrevorharmon/thetrevorharmon.com/issues/270#issuecomment-6548347212).

## Summary

Move to Astro 7 and output a static site only. This should take 6-9 focused days, plus about 1 day if the ANTLR editor needs `antlr4ng`. Posts stay where they are. The only edit to post content is adding `client:load` to the demo components in 6 posts.

## Why move

- Gatsby is in maintenance mode. The last release was 5.16.1 on 2026-02-10, and there were only 2 releases in the last 12 months.
- 300 of the 302 `yarn audit` advisories come through Gatsby. They can't be fixed without leaving Gatsby.
- `gatsby-plugin-mdx` is stuck on MDX 2, which blocks `remark-gfm` 4 and the other parked upgrades.

## Alternatives considered

This only covers tools that build a static site and can keep the React/CodeMirror demos. Release data was checked on 2026-10-31.

| Option                   | Latest release         | Releases, last 12 months | Verdict                                                                              |
| ------------------------ | ---------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| Astro                    | 7.4.4, 2026-10-28      | 113                      | **Pick.** Typed content, MDX 3, React only where needed                              |
| React Router 8           | 8.5.1, 2026-10-27      | 35                       | **Backup.** All React, but you build content loading, MDX and images yourself        |
| TanStack Start           | 1.169.4, 2026-10-22    | 366                      | Skip. Changes too often, and post pages only get built if another page links to them |
| Vike                     | 0.4.268, 2026-10-15    | 24                       | Skip. Pre-1.0, small community, no content or MDX layer                              |
| Waku                     | 1.0.0-rc.4, 2026-10-22 | 5                        | Skip. Not 1.0 yet, no documented MDX support                                         |
| Docusaurus               | 3.10.2, 2026-07-10     | 3                        | Only if a docs-style look is fine                                                    |
| Rspress 2                | 2.0.23, 2026-09-29     | 30                       | Skip. A docs tool with no blog built in                                              |
| Next.js                  | 16.4.3, 2026-10-23     | 87                       | Skip. Weak image handling for static sites, and too much for 42 posts (see #270)     |
| Eleventy / Build Awesome | 3.1.7, 2026-10-15      | 3                        | Skip. No MDX, so the demos would need rewriting                                      |

Hugo and VitePress are out because they don't run React. VitePress also hasn't had a release since 2025-08-05.

## What you get

- A maintained framework with a full-time team behind it.
- Most of the security warnings gone. This is expected but not yet verified.
- MDX 3. Tailwind 4 becomes its own job of about 1 day.
- Typed content: the rules in `gatsby-utils.js` become a zod schema. No GraphQL layer and no `gatsby-types.d.ts`.
- Much less JavaScript. Pages without demos ship about 4.8 KB gzipped (the `<ClientRouter />` script), compared to about 98 KB on `/blog/` today.
- Automatic image optimization for the 107 markdown images and the featured images.
- Official RSS and sitemap integrations that produce the same file names.
- Faster builds, since Vite replaces webpack + Babel. The flash of the wrong theme on page load probably gets fixed too.

## What has to change

- Rewrite the Gatsby-specific code: 3 layouts, 2 templates, 4 pages, `Link`/`Button`, SEO/meta, `Image`, the SVG icon imports, and the `gatsby-*` config files.
- Rebuild `Callout`, `TwoUp`, `Citation`, `Breakout` and `Link` as `.astro` components. Pass them to MDX through a `components` map instead of `MdxProvider`.
- Add `client:load` to the demo components in the 6 interactive posts (about 10 lines). Change type-only imports to `import type`.
- Replace `ThemeContext` with a small shared store and an inline `<head>` script (about 0.5-1 day). It's the only shared React context, and it's used by `ThemePicker`, `CodeEditor` and `ReactCodeMirrorSyncStateExample`.
- Get the ANTLR/Zephyr editor working under Vite. That means polyfills for `assert`/`buffer`/`util`, or switching to `antlr4ng`.
- Update `netlify.toml` (`dist/` and the new build command), and use Node >= 22.23.4.

## Decisions

1. **Page navigation: use `<ClientRouter />`.** Measured on Astro 7.4.4, it's about 4.8 KB gzipped and cached across pages. Prefetch on its own is about 1.2 KB. It gives Gatsby-style page swaps plus transitions. The cost is about half a day of extra testing, so the theme script and demos restart correctly on page swaps (`astro:page-load`).
2. **Shared state: use a small store for the theme.** Islands don't share React context. No demos share state today. If a future demo needs shared state, use nanostores (about 1 KB).
3. **Markdown: use Sätteri, not unified.** Sätteri is Astro 7's default processor. Use existing community plugins wherever possible (see the plugin map below).
4. **Syntax highlighting: keep Prism.** `@astrojs/markdown-satteri` 0.4.6 supports `syntaxHighlight: 'prism'`, so `syntaxHighlighting.scss` stays. Expressive Code is optional.
5. **Strict builds: keep the defaults.**
   - The strict compiler only checks `.astro` files, and those will all be new.
   - `.mdx` posts already have to be valid JSX.
   - Only 3 `.md` posts have raw HTML outside code samples (`staticquery-and-typescript`, `the-value-of-iterative-design`, `sell-things-fast-with-gatsby-and-shopify`), and their tags are all balanced.
   - Keep the `compressHTML: 'jsx'` default. It follows the same JSX whitespace rules the React components use today.
6. **Reading time: use `@xsynaptic/satteri-reading-time`.** The numbers don't need to match today's.
7. **Asset URLs: accept that they change.** Images move from `/static/<hash>/...` to `/_astro/...`. Optional: check the Netlify logs for outside traffic to `/static/*` before switching.
8. **Cloudflare ownership: accept it, with two rules.**
   - Keep the site purely static: no adapter, and no platform-specific image or server features.
   - About once a year, check how often the Netlify/Vercel adapters and Astro itself are releasing.

## Markdown plugin map (Sätteri)

| Today                                          | Under Sätteri                                                                                                                                | Weekly downloads (2026-10-31) |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `remark-gfm`                                   | Built in, on by default                                                                                                                      | -                             |
| Heading ids (`gatsby-remark-autolink-headers`) | `satteri-slug`                                                                                                                               | 630                           |
| Heading link icon                              | `satteri-autolink-headings`, with the existing SVG icon and `header-link` class                                                              | 730                           |
| `gatsby-remark-external-links`                 | `satteri-external-links`                                                                                                                     | 571                           |
| `gatsby-remark-prismjs`                        | `syntaxHighlight: 'prism'` (built in)                                                                                                        | -                             |
| `reading-time` in `gatsby-node.js`             | `@xsynaptic/satteri-reading-time`                                                                                                            | 172                           |
| Image captions (`showCaptions: ['title']`)     | Try `@jemjam/satteri-figcaptions` (15/week) or `satteri-figure` (2/week). Otherwise write about 20 lines of custom code                      | -                             |
| `plugins/rehype-better-footnote-links`         | Custom Sätteri plugin (about 30 lines). It must keep the `footnote--x` / `reference--x` ids and the arrow icon                               | -                             |
| `plugins/gatsby-remark-mermaid-to-svg`         | Try `@xingwangzhe/satteri-mermaid` (314/week) on the 9 diagrams. Fallback: a custom plugin of about 30 lines that inserts the committed SVGs | -                             |

**Watch out:** `@xingwangzhe/satteri-mermaid` 0.8.2 only works with `satteri` 0.10.x. Astro 7.4.4 uses `satteri ^0.10.5`, so it works today. If Astro moves to Sätteri 0.11, the plugin needs an update first. Also, `satteri-slug` and `satteri-autolink-headings` peer-require `satteri ^0.11.5`, while we pin 0.10.5. They work with 0.10.5 today (the peer warning is expected); re-check when Astro moves to 0.11.

## Hosting

- The free tiers of Netlify and Vercel both work. Sätteri, Rolldown and the mermaid renderer ship ready-made Linux binaries, so the build doesn't need to compile any Rust.
- **Netlify:** accounts created before September 2025 keep 300 build minutes and 100 GB bandwidth a month. Newer accounts get 300 credits a month; a production deploy costs about 15 credits, and previews are free.
- **Vercel Hobby:** free for personal, non-commercial use. Each build can run up to 45 minutes.
- Set `NODE_VERSION` to 22.23.4 or newer.

## Must stay identical

- Every `/blog/<slug>/` URL, with the trailing slash (`trailingSlash: 'always'`, `build.format: 'directory'`).
- `/`, `/blog/`, `/about/`, `/rss.xml`, `/sitemap-index.xml`, `/sitemap-0.xml` and `/robots.txt`.
- The `_redirects` rules (the `/projects/*` 301s).
- RSS guids, which have no trailing slash.
- Heading anchor ids and footnote anchor ids.

These can change: `/drafts`, the reading-time numbers and the hashed asset URLs.

## Phase 2 spike results

The spike ran on a throwaway branch, `astro-spike` (commit `a183d89`, not pushed), in the worktree `../thetrevorharmon.com-spike`. It is a minimal Astro 7.4.4 project in `spike/` with 4 real posts, Sätteri, `syntaxHighlight: 'prism'`, `<ClientRouter />`, and the real `syntaxHighlighting.scss`, `Mermaid.scss`, `CodeEditor` and demo components. Every check below ran in Chromium through Playwright against `astro build && astro preview`, and was compared with the old Gatsby site served from `../thetrevorharmon.com-gatsby`. Scripts, logs and screenshots are in `spike-evidence/` on that branch.

| #   | Risk                                 | Result                            | Fallback used                                                                   |
| --- | ------------------------------------ | --------------------------------- | ------------------------------------------------------------------------------- |
| 1   | ANTLR/Zephyr editor under Vite       | **Pass, after a one-line fix**    | Vite aliases for `assert`/`util`/`buffer`. `antlr4ng` is not needed             |
| 2   | Demos and `<ClientRouter />`         | **Pass**                          | None needed. Islands restart on their own after page swaps                      |
| 3   | Footnote ids on Sätteri              | **Pass**                          | Custom hast plugin (about 50 lines, mostly the icon)                            |
| 4   | `satteri-mermaid` diagrams           | **Pass, with 3 small shims**      | Stayed on `satteri-mermaid`. The committed-SVG plugin is not needed             |
| 5   | Prism output vs `syntaxHighlighting.scss` | **Pass, no changes**         | None needed                                                                     |

### 1. ANTLR/Zephyr editor: pass, with Vite aliases

- **First try failed.** The island hydrated with no visible error on the page, and the editor never appeared. The console showed `[astro-island] Error hydrating ... TypeError: Cannot read properties of undefined (reading 'custom')`. The cause is that `antlr4ts` is CommonJS written for Node. It does `require("assert")` (13 files) and `require("util")` (2 files; `BitSet` uses `util.inspect.custom`). Vite 8 replaces Node builtins with an empty stub in the browser, so `util.inspect` is `undefined`. The build only printed `Module "assert" has been externalized for browser compatibility` warnings.
- **Fix that worked:** install the npm polyfills and alias them.

  ```sh
  npm i util@0.12.5 assert@2.1.0 buffer@6.0.3
  ```

  ```js
  // astro.config.mjs
  vite: {
    resolve: {alias: {assert: 'assert', util: 'util', buffer: 'buffer'}},
  },
  ```

  After this the warnings are gone. The `fs` require in `antlr4ts` is only on a Node-only path and never runs.
- **Evidence** (`spike-evidence/logs/demos-new-astro-clientrouter.log`): the editor mounts, 4 highlighted token spans with 4 distinct classes (`text-fuchsia-700`, `text-blue-600`, `text-orange-700`, `text-lime-600`), the same as Gatsby. Typing `let answer = 42; // hi` takes the token table from 6 to 12 rows and the highlighted spans from 4 to 9, the same numbers as Gatsby. There are no console errors.
- **Tolerated console noise:** ANTLR's default error listener logs `token recognition error at: '/\n'` when you type a single `/` on the way to `//`. Gatsby does exactly the same, so the tests ignore that one message.
- **For Phase 7:** use the aliases. Do not switch to `antlr4ng`, so the +1 day is not needed. The generated lexer/parser in `src/components/CodeEditor/extensions/zephyr/language/build/` works as is, apart from the `import type` fixes described below.

### 2. Demos and ClientRouter: pass

- **What was tested:** `ButtonExample` (counter 1 to 2), `ReactCodeMirrorSyncStateExample` (two backspaces take the state to `2 / codemirror`, the React button to `3 / react`, "Stop linting" removes the lint marker) and the ANTLR editor. These were run on a fresh load, then via client-side navigation (blog index to ANTLR post, to "All posts", to demo post), then after browser back, back, forward, forward.
- **Soft navigation was real.** A `window.__spike` marker survived every step, so no full reloads happened. The demos worked after each swap. 28 checks passed with 0 failures.
- **No `astro:page-load` restart code was needed** for the islands. Astro re-hydrates `client:load` islands when ClientRouter swaps the body. The only script that needs swap handling is the theme script (see below).
- **Theme script:** apply the theme in `astro:before-swap` to `e.newDocument`, otherwise the new page flashes light. The spike's inline script does this (`spike/src/layouts/Layout.astro`).
- **Theme in islands:** a `useSyncExternalStore` hook that watches `<html data-theme>` with a `MutationObserver` replaced `ThemeContext` (`spike/src/context/ThemeContext.tsx`, 20 lines, no provider). With the dark colour scheme the Astro editor gets `cm-theme-dark`. The Gatsby site, in the same dark emulation, still renders `cm-theme-light`, so this is better than today. Phase 4 can reuse this idea.
- **Gotcha, `import type`:** Rolldown does not erase unused type imports across files. The build failed with `MISSING_EXPORT` errors like `"Diagnostic" is not exported by @codemirror/lint` and `"State" is not exported by .../CodeEditor.tsx`. Fix: turn on `verbatimModuleSyntax`, run `tsc --noEmit`, and change every `TS1484` into `import type` or an inline `type` modifier. The spike needed about 20 of them in the files it copied (`CodeEditor.tsx`, `ParserAdapter.ts`, `zephyr/constants.ts`, the generated ANTLR files, the demos). The whole site will need this pass (planned in Phase 3.1), not only in the 6 demo posts.
- **Other gotchas:**
  - Any component that imports `gatsby` (`Button`, `Link`, `Icon` with SVG imports) must be rewritten first. The spike used stubs.
  - `src/content/**/*.tsx` is picked up by the content glob's module graph, so demo components that live next to posts work fine.
  - `client:load` goes on the demo tag inside the `.mdx`, for example `<ButtonExample client:load />`.

### 3. Footnote ids: pass, custom plugin

- **Sätteri does not do this alone.** `gfm.footnotes.clobberPrefix` can only change the `user-content-` part, and the `fn-` / `fnref-` pieces stay, so `footnote--x` and `reference--x` can't be produced from options. A small hast plugin does it. The code is `spike/plugins/better-footnote-links.mjs`.
- **How it works:** one `element` visitor with `filter: ['a', 'li']`.
  - `li[id^=user-content-fn-]` becomes `footnote--x`.
  - `a[data-footnote-ref]` gets id `reference--x` and href `#footnote--x`.
  - `a[data-footnote-backref]` gets href `#reference--x` and its text node replaced with the arrow SVG.
  - Property names in Sätteri's hast are camelCase for `data-*` (`dataFootnoteRef`, `dataFootnoteBackref`).
- **Gotcha:** `ctx.replaceNode(node, {raw: '<svg ...>'})` works for Markdown but fails when compiling MDX with `satteri: cannot encode replacement content into the structural op-stream`. Build the SVG as structured hast elements (`{type: 'element', tagName: 'svg', properties, children}`) as the plugin does.
- **Evidence** (`spike-evidence/logs/footnotes.log`, `spike-evidence/footnotes-compare.json`) for `/blog/loaves-and-fishes/`: 8 references and 8 list items on both sites. Reference ids and hrefs, `li` ids, backref hrefs, `aria-label` and class are identical to Gatsby. All 8 backrefs have the arrow SVG, and no `user-content-` strings are left in the page. In a browser, clicking a reference lands on an existing `#footnote--mark-6_33-36`, and clicking its backref lands on `#reference--mark-6_33-36`.
- **Small differences from Gatsby, both harmless:** the backref has `data-footnote-backref` with no `="true"`, and the footnote links lack `target="_blank" rel="nofollow noopener noreferrer"`. The second one is `satteri-external-links`, which is still to do.
- **Not tested:** a footnote referenced twice (Sätteri adds `-2` ids). The prefix replace should handle it. Check it when the plugin is ported for real.

### 4. Mermaid: pass, with shims

All 9 `mermaid` fences in the real blog render in Merman with no failures. These are the 9 diagrams: 3 in `codemirror-and-react`, 3 in `displaying-mermaid-charts-in-gatsby`, 2 in `learning-codemirror` and 1 in `advanced-state-management-with-react-and-codemirror`. The old build has the same 9 SVGs. A tenth fence, `mermaid-code`, is shown as code and is not a diagram (`spike-evidence/logs/mermaid-all-fences.log`). Screenshots, old vs new, light and dark, are in `spike-evidence/mermaid-raw/` (plugin defaults) and `spike-evidence/mermaid-tweaked/` (final).

Out of the box the diagrams were not acceptable. Three things needed fixing, all small:

1. **`\n` in labels shows as text.** Mermaid.js turns `\n` into a line break, but Merman prints `Update state\nfield`. Fix with an mdast plugin that runs before `mermaidMdast()` and rewrites `\n` to `<br/>` (`spike/plugins/mermaid-tweaks.mjs`, `mermaidNewlines`).
2. **Wrong wrapper class.** The plugin outputs `<div class="mermaid" data-mermaid-ssg="true">`, but `Mermaid.scss` targets `.Mermaid`. A tiny hast plugin run after `mermaidHast()` sets `class="mermaid Mermaid"` (`mermaidWrapperClass`).
3. **Colours and fonts.** Merman scopes its CSS to the svg's `#satteri-mermaid-N` id, which beats `.Mermaid .node rect`, so the old `Mermaid.scss` rules lose. It also puts `background-color:white` inline on the svg. Fixes:
   - Pass `theme: 'base'` and `themeVariables` (`primaryColor: '#3b82f6'`, `primaryBorderColor: '#1d4ed8'`, `primaryTextColor: '#ffffff'`, `lineColor` and `textColor: '#78716c'`, `edgeLabelBackground: '#78716c'`, JetBrains Mono at 14px). This gives the blue nodes and grey edges from the old SVGs.
   - Append to `Mermaid.scss`: `.Mermaid > svg {background-color: transparent !important}`, plus `!important` cluster rules for subgraphs (fill `stone-50` / `dark:stone-900`, stroke `stone-300` / `dark:stone-700`, label text `stone-800` / `dark:stone-200`). Without these, subgraphs come out orange.

Result: the final diagrams match the old ones closely in layout, colours, font, subgraph styling and dark mode. Edges are slightly thinner and the box is a bit narrower. The narrower box is the spike layout, not the plugin. This is acceptable, and a visual sign-off is still needed in Phase 6 as planned.

- **Output quirks:** the svg root has an odd `:xmlns="..."` attribute (harmless in HTML), and Merman 0.7.0 double-escapes `<` in flowchart labels (no current diagram uses one).
- **`mermaid-code` fences:** the old plugin turns `mermaid-code` fences (used in `displaying-mermaid-charts-in-gatsby` to show diagram source) into plain `mermaid` code blocks. `satteri-mermaid` only handles `langs: ['mermaid']` and leaves `mermaid-code` alone, so check that post when porting, since it may need a rename or a small plugin.
- **Versions:** `@xingwangzhe/satteri-mermaid@0.8.2` with `satteri@0.10.5` (via `@astrojs/markdown-satteri@0.4.6`). Pin them both, because the plugin's peer range is `>=0.10.5 <0.11.0`. macOS arm64 and Linux x64/arm64 (glibc) have binaries, which covers local work and Netlify.
- **Decision:** use `satteri-mermaid`. The committed `diagrams/*.svg` files are not needed, so `remove-mermaid-svgs` and the 9 diagram folders can go in Phase 8. The committed SVGs stay a valid fallback if a future upgrade breaks it.

### 5. Prism: pass, no changes

- `markdown.syntaxHighlight: 'prism'` works for MDX too (via the `satteri()` processor). `syntaxHighlighting.scss` was used unchanged.
- **Evidence** (`spike-evidence/logs/prism.log`, `spike-evidence/prism/prism-compare.json`, `spike-evidence/prism/code-block-*.png`): for 3 posts, in light and dark, there were 15/15, 14/14 and 11/11 code blocks. The `pre`/`code` class sets and all token class combinations are identical (19, 18 and 13 combos), and there are 0 differences in computed colour. The screenshots are visually identical.
- **Markup differences:**
  - Gatsby wraps blocks in `<div class="gatsby-highlight" data-language="js">`. Astro emits `<pre class="language-js" data-language="js">` directly. `syntaxHighlighting.scss` never uses `.gatsby-highlight`, so nothing breaks.
  - A fence with no language is `language-text` on Gatsby and `language-plaintext` on Astro. Both match `[class*='language-']`.
  - `.gatsby-highlight-code-line` in the scss is dead code for this site.

### Other notes for later phases

- **Pinned versions used:** `astro@7.4.4`, `@astrojs/mdx@8.1.2`, `@astrojs/react@7.1.2`, `@astrojs/markdown-satteri@0.4.6`, `satteri@0.10.5`, `@xingwangzhe/satteri-mermaid@0.8.2`, `tailwindcss@3.4.19`, `sass@1.107.1`, `react@19.3.1`, `typescript@7.0.2`. `@astrojs/mdx` 8.x peers `astro ^7.2.10`.
- **Sätteri config shape (works for `.md` and `.mdx`):**

  ```js
  markdown: {
    syntaxHighlight: 'prism',
    processor: satteri({
      features: {gfm: {footnotes: {label: 'Footnotes', backLabel: 'Back to content'}}},
      mdastPlugins: [mermaidNewlines(), mermaidMdast()],
      hastPlugins: [mermaidHast({theme: 'base', themeVariables: {...}}), mermaidWrapperClass(), betterFootnoteLinks()],
    }),
  },
  ```

  Plugin order matters: `mermaidNewlines` before `mermaidMdast`, and `mermaidWrapperClass` after `mermaidHast`.
- **Tailwind 3 + SCSS on Vite 8 (risk 6) worked** with `tailwind.config.cjs` and `postcss.config.cjs` copied over (the spike is `"type": "module"`, so the configs need `.cjs`), and `global.scss` compiled with `@apply`. Sass prints `@import` deprecation warnings. The `~@fontsource/...` imports in `global.scss` must become plain package imports (the spike just dropped them).
- **Build speed:** the spike builds 5 pages in about 1 second. Tailwind's `content` globs need `./src/**/*.astro` added.
- **Not tested in the spike:** `astro dev` (only `build` and `preview`), heading ids/links, external links, images and captions, RSS and sitemap, and the `Callout`/`Citation` components as `.astro` files (the spike passes the existing React ones through `components={{...}}`, which works).

## Untested risks

| #   | What                                                          | Status after Phase 2                                                           | If it fails                                                 |
| --- | ------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| 1   | The ANTLR/Zephyr editor under Vite                            | **Passed.** Needs Vite aliases for `assert`/`util`/`buffer`. No `antlr4ng`     | -                                                           |
| 2   | Demos working in a browser, and `<ClientRouter />` page swaps | **Passed.** Needs `import type` cleanup and `client:load`                      | -                                                           |
| 3   | Footnote ids on Sätteri                                       | **Passed.** Custom hast plugin, ids and icon match                             | -                                                           |
| 4   | `satteri-mermaid` on the 9 diagrams                           | **Passed with 3 shims** (`\n`, wrapper class, theme variables + CSS)           | Use the custom plugin with the committed SVGs               |
| 5   | Prism on Sätteri matching `syntaxHighlighting.scss`           | **Passed.** Identical classes and colours, no changes                          | -                                                           |
| 6   | Tailwind 3 + SCSS on Vite 8                                   | Worked in the spike (needs `.cjs` configs). Still to do properly in Phase 4    | Small config fixes                                          |
| 7   | Heading anchors matching                                      | Untested                                                                       | Adjust the plugin options                                   |
| 8   | Images: optimization, the 4 gifs, captions, featured/OG image | Untested                                                                       | Custom caption plugin, or move the gifs to `public/`        |
| 9   | RSS and sitemap matching                                      | Untested                                                                       | Adjust the RSS endpoint                                     |

**Next step:** go. Continue with the full staged plan in #270 (Phase 3 onward). `docs/plan.md` already has the spike's findings folded in: the Vite aliases, `.cjs` configs and `import type` pass in Phase 3.1, `Link`/`Button`/`Icon` first in Phase 5, the footnote and mermaid plugins reused from the `astro-spike` branch in Phase 6, and no `antlr4ng` in Phase 7.

## Sources

- [Astro v7 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v7/)
- [Sätteri features](https://satteri.bruits.org/docs/features/)
- [Sätteri plugins](https://satteri.bruits.org/docs/plugins/)
- [Community Sätteri plugin ports](https://github.com/Ashish-CodeJourney/satteri-plugins)
- [InfoQ on Sätteri](https://www.infoq.com/news/2026/08/astro-satteri-rust/)
- [Astro 6 to 7 on a 1,558-post blog](https://lilting.ch/en/articles/astro-6-to-7-upgrade)
- [Cloudflare acquires Astro](https://www.businesswire.com/news/home/20260116386991/en/Cloudflare-Acquires-Astro-to-Accelerate-the-Future-of-High-Performance-Web-Development)
- [Netlify credit-based plans](https://www.netlify.com/changelog/netlify-pricing-update-introducing-credit-based-plans.md)
- [Vercel limits](https://vercel.com/docs/limits)
- [Eleventy is now Build Awesome](https://www.11ty.dev/blog/build-awesome/)
- [React Router pre-rendering](https://reactrouter.com/how-to/pre-rendering.md)
- [TanStack Start static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering)
