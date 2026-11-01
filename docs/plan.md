# Astro migration plan

These are the tasks for moving this site from Gatsby to Astro 7, start to finish. Each task says how to check that it's done. The background and decisions are in `docs/astro-migration-research.md` and issue #270.

## Ground rules

- Do the work on the `astra-migration` branch. `main` stays on Gatsby until the cut-over.
- **Old** means the Gatsby site from the tag `gatsby-final`. It's built in a separate worktree and served at `http://localhost:9000` (`yarn build && yarn serve`).
- **New** means the Astro site, served with `astro build && astro preview` at `http://localhost:4321`.
- The shell's default Node is too old. Run `export PATH=~/.nvm/versions/node/v22.23.4/bin:$PATH` before any `node`, `yarn` or `npx` command.
- The regression suite (task 1.2) is built first and tested against the old site, so you can trust it before any Astro code exists.
- **Stale cache:** Astro's content cache ignores markdown plugin changes. After editing anything in `src/markdown/` or the processor config, build with `rm -rf .astro node_modules/.astro dist && yarn build`, or you test old output.
- **Scoped CSS:** Gatsby made every imported `.scss` global. Astro only ships a stylesheet on pages whose components import it (or via `global.scss`). A component that uses a class must import the stylesheet that defines it. Audit at Phase 7: `global.scss` pulls in `syntaxHighlighting` and `Mermaid`; `Carousel.astro`, `Icon.tsx` and `CodeEditor.tsx` import their own. Only `ReactCodeMirrorSyncStateExample` was missing one (fixed).
- Differences we expect and accept go in one allowlist file, `tests/parity/expected-differences.ts`. Those are the reading-time numbers, the hashed asset URLs, `/drafts` and how the mermaid diagrams render. Any other difference is a regression.

## Phase 1: Baseline (0.5-1 day)

### 1.1 Freeze the Gatsby site

- Tag `main` as `gatsby-final`. Create a worktree from it at `../thetrevorharmon.com-gatsby` and run `yarn install && yarn build`.
- **Validate:** `yarn serve` in the worktree serves the site at `http://localhost:9000`, and it matches production.

### 1.2 Build the regression suite and test it on the old site

- Add `@playwright/test` and a `playwright.config.ts` with two projects: `old` (uses `OLD_URL`) and `new` (uses `NEW_URL`). The tests go in `tests/parity/`.
- Build the list of pages to test from the old site's `sitemap-0.xml`, plus `/404/` and `/drafts/`.
- The reading list on each post is random, because `buildReadingList` uses `lodash.samplesize`. Hide that section in screenshots, and only check that it has the right structure.
- For screenshots, set `snapshotPathTemplate` without `{projectName}`. Then `--project=old --update-snapshots` saves the old screenshots, and `--project=new` compares against them.
- **Validate:** point both `OLD_URL` and `NEW_URL` at the old site and run the whole suite. Everything passes, twice in a row, which shows the tests aren't flaky.

### 1.3 Capture the baseline data

- Write a script, `scripts/parity/inventory.mjs`, that reads the old build and saves `tests/parity/baseline.json` with:
  - every HTML path
  - the sitemap `<loc>` list
  - the RSS items (`guid`, `link`, `title`, `pubDate`)
  - each page's title, description, canonical and OG tags
  - heading ids and footnote ids
  - image count and alt text
  - outgoing links
- **Validate:** it contains 41 post pages plus `/about/`, `/`, `/blog/` and `/pumpkins/`. The number of sitemap entries matches the number of published HTML pages, and there are 40 RSS items (one post is Archived, so it is not in the feed).

## Phase 2: Risk test (1 day) - done, all five passed

The spike code is on branch `astro-spike` (commit `a183d89`, in `spike/`). Results and gotchas are in `docs/astro-migration-research.md`.

### 2.1 Test the five riskiest parts on a throwaway branch

- Build four posts with Sätteri, Prism and `<ClientRouter />`: one demo post (`codemirror-and-react`), one ANTLR post, one footnote post and one mermaid post.
- **Validate:** click through each one in a browser and check that:
  1. The ANTLR/Zephyr editor loads and highlights tokens.
  2. The demos respond to typing, and still work after you navigate away and come back with ClientRouter.
  3. Footnote ids are `footnote--x` / `reference--x`, with the arrow icon.
  4. The `satteri-mermaid` diagrams look acceptable next to the old SVGs.
  5. The Prism output matches `syntaxHighlighting.scss`.
- Record what passed and failed, and any fallback you picked, in `docs/astro-migration-research.md`. Decide whether to continue before moving on.

## Phase 3: Scaffold (1 day)

### 3.1 Set up Astro

- Install `astro@7.4.4`, `@astrojs/react`, `@astrojs/mdx`, `@astrojs/sitemap` and `@astrojs/rss`.
- Create `astro.config.mjs` with `site`, `trailingSlash: 'always'`, `build.format: 'directory'`, `markdown.syntaxHighlight: 'prism'`, `react()`, `mdx()` and `sitemap()`.
- Set `.nvmrc` and `netlify.toml` to Node 22.23.4.
- Install `util@0.12.5`, `assert@2.1.0` and `buffer@6.0.3`, and add Vite aliases for them (`vite.resolve.alias`). The ANTLR editor needs them (Phase 2, risk 1).
- Use `.cjs` for `tailwind.config` and `postcss.config`, because the project will be `"type": "module"`. Add `./src/**/*.astro` to the Tailwind `content` globs.
- Turn on `verbatimModuleSyntax`, run `tsc --noEmit`, and change every `TS1484` error to `import type` (about 20 in the demo files alone). Rolldown fails the build on type imports that are not marked.
- **Validate:** `astro build` and `astro check` pass with a placeholder page.

### 3.2 Content collection

- Create `src/content.config.ts` with the zod schema from #270 and `glob()` loaders for two collections: `blog` (41 posts) and `pages` (`about`, `pumpkins`).
- Note: `yarn check` is yarn's own command, so run the Astro check with `yarn run check`.
- Port `validateNode` to `src/lib/`. It runs the checks that span more than one post: the slug equals the filename, and every `related_reading` slug exists.
- Port `buildReadingList` to `src/lib/` too, and fix its existing bug where the "already in curated picks" filter never removes anything.
- **Validate:** all 43 entries load (41 posts in `blog`, plus `about` and `pumpkins` in `pages`, which share the schema). If you break one frontmatter field on purpose, the build fails with a clear message. For 3 posts with `related_reading`, the curated picks come first.

## Phase 4: Styles and theme (1 day)

### 4.1 Tailwind 3 and SCSS

- Import `global.scss` in the base layout. Add `.astro` and `.mdx` to the Tailwind `content` globs. Remove the duplicate `@tailwind` block in `CodeEditor.scss`.
- **Validate:** a test page with typography, colors and spacing matches the old site's screenshot. The compiled CSS has only one copy of Tailwind's base styles.

### 4.2 Theme store

- Replace `ThemeContext` with a small store. Add an inline `<head>` script that sets the theme class on `<html>` before the page first paints.
- `ThemePicker` becomes an island (`client:load`). `CodeEditor` and `ReactCodeMirrorSyncStateExample` read the theme from the store.
- **Validate (Playwright):**
  - Light, dark and system each apply.
  - The choice survives a reload and a ClientRouter navigation.
  - The right class is on `<html>` before the first paint, so there's no flash.
  - Changing the theme updates an editor that's already open.
- **Done (notes):**
  - The theme class now lives on `<html>`, not `<body>`. `global.scss` uses `html.light body` / `html.dark body`. Tailwind's `dark:` variants use `darkMode: 'class'`, so they work unchanged. Nothing else read the body class.
  - The store is `src/lib/theme.ts`. The inline script is in `src/layouts/BaseLayout.astro`. They share the old localStorage key `theme` and `{theme, followSystem}` shape.
  - Run the theme tests: `yarn build && yarn preview`, then `npx playwright test theme.spec.ts --project=new`. They use real pages (`/about/`, `/blog/codemirror-and-react/`); the E2E pages were removed in Phase 5. For `--project=old`, serve the Gatsby site on :9000. Two tests skip on old by design (before-first-paint, no wrong theme during navigation).

## Phase 5: Layouts, pages and components (2-3 days)

### 5.1 Layouts and head

- Port `Layout`, `PostLayout`, `PageLayout`, `Navbar`, `Footer`, and SEO/meta into `<head>`. Add `<ClientRouter />` to the base layout. `useSiteData` becomes a constant.
- **Validate:** each page's title, description, canonical and OG tags match `baseline.json`.

### 5.2 Pages

- Create `index.astro`, `blog/index.astro`, `blog/[slug].astro`, `[slug].astro` (for the about page), `drafts.astro` and `404.astro`.
- **Validate:** the set of HTML paths in `dist/` is the same as the old site's, apart from the allowed differences. Each type of page looks right on desktop and mobile.

### 5.3 Components

- Rebuild `Callout`, `TwoUp`, `Citation`, `Breakout` and `Link` as `.astro` components, and pass them to MDX through `components`.
- Rewrite `Link`, `Button` and `Icon` without Gatsby first, early in this phase. Other components import them, and the Phase 2 spike used stubs. Do `Image` and the featured image with `astro:assets`.
- Port the SVG icons, `PostTile`, `FeaturedTile` and `ReadingList`.
- The `Icon` component needs an SVG approach: Vite imports `.svg` as a URL, not a component. The theme icons are already inline TSX (`ThemePicker/icons/index.tsx`).
- Remove `src/pages/e2e/` once real posts with editors render, and point `tests/parity/theme.spec.ts` at real pages.
- **Validate:** screenshots of the 12 MDX posts that use these components match the old ones.
- **Done (notes):**
  - Icons: `?raw` SVG imports inlined by `Icon.tsx` (React, so demos and `.astro` files share it). `Button` and `Icon` stay React; everything else is `.astro`. `components/index.tsx` only exports those two.
  - `Link.astro` adds trailing slashes to internal URLs and `aria-current`. `Carousel.astro` and `TwoUp.astro` parse the slot's `<img>` tags; the carousel arrows are a `th-carousel` custom element (no island).
  - `markdown.smartypants: false` so quotes match the old site. The reading time is a placeholder (`1`) in `blog/[slug].astro` until 6.1.
  - `codemirror-and-react` has `client:load` on its two demos (needed for the theme test). Phase 7 does the rest.
  - Still open for Phase 6: heading ids/links, external links, figcaptions, footnotes, mermaid, image wrappers/alt fallback, gifs, and links written without a trailing slash in markdown. `/rss.xml`, `robots.txt`, manifest and `/favicon.png` are Phase 8.

## Phase 6: Markdown on Sätteri (1-1.5 days) - done

### 6.1 Community plugins

- Add these plugins:
  - `satteri-slug`
  - `satteri-autolink-headings`, with the existing icon and the `header-link` class
  - `satteri-external-links`
  - `@xsynaptic/satteri-reading-time`
  - a figcaption plugin: `@jemjam/satteri-figcaptions`, or about 20 lines of custom code
- **Validate:**
  - Heading ids match the baseline on every page.
  - External links have the same `rel` and `target`.
  - Images with a title have a `<figcaption>`.
  - Reading time shows on every post.

### 6.2 Footnotes

- Reuse `spike/plugins/better-footnote-links.mjs` from the `astro-spike` branch. It already produces `footnote--x` / `reference--x` ids and the arrow icon. Build the icon as hast elements, not raw HTML, because raw HTML fails in MDX.
- **Validate:** footnote ids and hrefs match the baseline on every page. Clicking a footnote, and then its back arrow, scrolls to the right place.

### 6.3 Mermaid

- Use `@xingwangzhe/satteri-mermaid@0.8.2` (pin it, with `satteri@0.10.5`). Reuse `spike/plugins/mermaid-tweaks.mjs` and the `Mermaid.scss` additions from the `astro-spike` branch. They fix `\n` in labels, the wrapper class and the theme colours. The committed-SVG fallback is not needed.
- The 9 `mermaid` fences are the diagrams. The 1 `mermaid-code` fence in `displaying-mermaid-charts-in-gatsby` must show as a highlighted code block, so it needs a rename or a small plugin.
- **Validate:** all 9 diagrams render in light and dark mode. After a visual review signs them off, add them to the allowlist.

### 6.4 Images

- Run markdown images through `astro:assets`, and handle the 4 gifs, the featured images and the OG image URL.
- **Validate:** each page has the same image count and alt text as the baseline. The gifs still animate (they have more than one frame). OG image URLs return 200.
- **Done (notes):**
  - Custom plugins are in `src/markdown/` (headings, links, images, image-service, footnotes, mermaid, code-lines); community plugins are pinned in `package.json`. The one `.md` to `.mdx` rename (`sell-things-fast-with-gatsby-and-shopify`) is the only content change; slug, URL and frontmatter are the same.
  - Images: at most 800px for `src`, with a 200/400/800/1600 srcset and `sizes="(min-width: 800px) 800px, 100vw"`, same as the old site. A hast property can't carry a list, so `images.mjs` sets `data-widths="200,400,..."` and `image-service.mjs` turns it into `widths`. Gifs pass through untouched (still animate).
  - Mermaid: all 9 diagrams reviewed by eye in light and dark and signed off. The visual tests force `.Mermaid` boxes to 320px on both sites. Edge-label boxes were made solid in `Mermaid.scss`.
  - Allowlist: `maxDiffPixelRatio` 0.004 on two pages of screenshots-of-text (`s3-select`, `email-signup`); only pixels inside the screenshot images differ. The 0.2% default is unchanged.
  - Footnote clicks checked in a browser with ClientRouter: ref to footnote and back arrow both scroll to the right place, with no reload and no console errors.
  - Parity: visual 168/188 (the 20 are the CodeMirror demo pages, Phase 7), anchors 47/47, content 47/47, links fail only on `/rss.xml` (41, Phase 8), feeds 0/3 (Phase 8).
  - **For Phase 9 (Lighthouse and quality):** no srcset gap for body images. Images are WebP where the old site used JPEG, so check sizes in Lighthouse. Carousel photos reuse the content-column `sizes`, so they may load larger than needed.

### Phase 6 handoff (to Phase 7)

Demo editors (`.cm-editor`) height, old vs new, on the 5 demo pages. Only `codemirror-and-react` mounts editors today.

- `learning-codemirror`: old 195, 175, 157, 129px; new not mounted (page 19844 vs 19217px).
- `codemirror-and-react`: old 170px, new 198px for the one mounted editor (172 vs 198 in the visual diff; page 17057 vs 17183px). Check the editor's padding or status bar.
- `advanced-state-management-with-react-and-codemirror`: old 109, 109px; new not mounted (page 12172 vs 11997px).
- `connecting-antlr-to-codemirror-6-building-a-language-server`: old 69px; new not mounted.
- `connecting-antlr-to-code-mirror-6-connecting-a-language-server`: old 109px; new not mounted.
- Add `client:load` to the demos; the 20 failing visual tests should then pass once the heights match.
- srcset gap: none for body images (see the Phase 9 note above).

### Phase 5 handoff (to do in Phase 6)

Verified in Phase 5: the components (Callout, Citation, Breakout, TwoUp, Carousel) match the old site pixel for pixel at 1280px and 390px, except for the items below. `/`, `/blog/`, `/404/` and `/drafts/` match exactly. `visual` is 84/188 now; every remaining diff comes from the items below.

- Heading link icons (`header-link`) are missing everywhere (6.1). Headings add no height without them, so only the icon differs.
- Figcaptions from image titles are missing (6.1).
- Markdown images render as a bare `<img>` instead of the Gatsby wrapper. Rounded corners, spacing and page height drift (about 10-1000px on image-heavy pages: `about`, `codemirror-and-react`, `learning-codemirror`, `displaying-mermaid-charts-in-gatsby`). Full-page visual diffs on these pages stay unreadable until 6.4 lands. Also, images are not resized yet (3000px originals, so the pages are heavy).
- Gifs are webp stills or the wrong frame (6.4). `about` TwoUp #2 shows a different frame from the old site. One gif is missing and the empty-alt fallback is still open (`content.spec`, 2 failures).
- Mermaid diagrams are not rendered (6.3).
- Footnote ids and links (6.2), `anchors.spec` 2 failures.
- Reading time is a placeholder (6.1).
- External links lack the old `rel`/`target` (6.1).
- Inline code: Gatsby added `language-text` to inline `<code>`. Phase 5 styles `:not(pre) > code` directly in `src/styles/syntaxHighlighting.scss` instead. If 6.1 adds a class to fenced code, check that code blocks still match.
- Callout height differs by 1-4px in 5 callouts that contain inline code or links (`loose-null-checks`, `advanced-state-management` #3, `connecting-antlr...building`, `codemirror-and-react` #2 and #3). Re-check after the plugins above. Likely the missing external-link styling.
- Carousel caveat: the caption comes from the image `title`. The carousel parses the slot's `<img>` tags, so if 6.4 wraps images in `<figure>` or changes the markup, update `Carousel.astro` so it still finds each `<img>`, `width`, `height` and `title`. Check `/pumpkins/` at 1280px and 390px afterwards.
- Links written without a trailing slash in markdown (about 2 internal link failures in `links.spec`, e.g. `https://thetrevorharmon.com/blog/what-I-learned-from-a-failed-startup`): the old pages have the same links and the old site 301'd them. Netlify also redirects `/x` to `/x/` for directory output, so production is fine, but check this in the Phase 9 deploy preview. A small link-normalising plugin in 6.1 would fix it at the source.
- `/rss.xml` links (41 `links.spec` failures) and `feeds.spec` (3) are Phase 8.

## Phase 7: Interactive demos (1 day) - done

### 7.1 Demo posts

- Add `client:load` to the demo components in the 5 posts, and change type-only imports to `import type`.
- For ANTLR, the Vite aliases from Phase 3.1 are enough. `antlr4ng` is not needed.
- **Validate (Playwright, one test per demo):**
  - The editor loads.
  - Typing produces the expected change, such as a decoration, a lint marker, tokens or synced state.
  - There are no console errors.
  - It still works after navigating away and back with ClientRouter.
  - The editor follows theme changes.
- **Done (notes):**
  - 5 demo posts (not 6), 11 components, all `client:load`. Content changes are directives only. ANTLR works with the Phase 3.1 aliases.
  - Height gap root cause: `ReactCodeMirrorSyncStateExample.tsx` never imported `CodeEditor.scss`, so its page did not get the editor styles (see the scoped-CSS rule in Ground rules). Fixed by adding the import.
  - Layout shift: `CodeEditor` sets `--cm-lines` (from `lineCount.ts`) and `CodeEditor.scss` reserves `min-height` on the `:empty` theme wrapper only, so it stops applying once CodeMirror mounts.
  - **Known, accepted gap (for Phase 9 Lighthouse/CLS):** `learning-codemirror` still shifts 20-46px per editor on hydration, because extension panels are not reserved.
  - `tests/parity/demos.spec.ts`: 10 tests (load, type/click changes state, no console errors, soft navigation with a window marker then re-test, theme on a live editor). Pass 10/10 on old and new. Removing `client:load` from one demo makes its test fail.
  - Parity on new: visual 188/188; only failures are 41 `/rss.xml` links and feeds 0/3 (Phase 8). `pending.spec.ts` keeps only the redirect and Lighthouse placeholders.

## Phase 8: Generated files, cleanup and CI (0.5-1 day) - done

### 8.1 Feeds and static files

- Add:
  - `src/pages/rss.xml.ts`, with guids that have no trailing slash
  - the sitemap
  - `public/robots.txt`
  - `public/manifest.webmanifest` and its icons
  - `public/_redirects`, unchanged
  - `public/_headers` for `/_astro/*`
- **Validate:**
  - The RSS item count, `guid`, `link`, `title` and `pubDate` match the baseline exactly.
  - The sitemap `<loc>` lists match, and `robots.txt` matches.
  - The manifest is valid JSON and its icon URLs work.

### 8.2 Remove Gatsby and update tooling

- Remove the temporary Phase 3 workarounds: `resolutions.cookie`, the `@emnapi/runtime` devDependency, and the `src/templates` exclude in `tsconfig.json`.
- Remove the unused `lodash.samplesize` and `object-shape-validator` dependencies.
- Remove the Gatsby dependencies, the `gatsby-*` files, `gatsby-types.d.ts`, `graphql.config.js` and `netlify-plugin-cache`.
- Update the `package.json` scripts (`develop`, `build`, `serve`, `tophat`), `netlify.toml` (`dist/`), the README, the PR template and the Dependabot ignores.
- Set CI to run the build, `astro check`, lint and the Playwright suite against the new build.
- **Validate:** the `yarn audit` count is near zero (write the number down). CI is green, and a Netlify deploy preview builds.

- **Done (notes):**
  - Static files: `public/` holds `_redirects` (moved from `static/`, unchanged), `_headers`, `robots.txt`, `manifest.webmanifest` and `icons/` (copied byte-for-byte from the old build), `favicon-32x32.png`, and `favicon.png` (from `src/images/favicon.png`; the old site linked it as the og:image but never served it). `<head>` has the same sitemap, icon, manifest, apple-touch-icon and RSS links as the old site.
  - `_headers` has a `/_astro/*` immutable one-year cache rule, plus the four security headers that `gatsby-plugin-netlify` used to generate on `/*`. The old per-file `Link:` preload headers are not carried over.
  - `src/pages/rss.xml.ts`: 40 Published posts, `guid` and `link` without a trailing slash, `pubDate` at midnight US Central (the old build machine's zone), the old namespaces, and `content:encoded` as a 140-character excerpt. The excerpt is a best-effort copy of Gatsby's MDX excerpt: 4 of 40 teasers differ by a word or a full stop, and the old channel had `<generator>` and `<lastBuildDate>`, which `@astrojs/rss` does not write.
  - Sitemap: same 45 `<loc>` values as the old site, in a different order.
  - `@emnapi/runtime` stays as a devDependency: without it `astro check` fails (`@astrojs/astro2tsx > @napi-rs/wasm-runtime` cannot load it).
  - Also removed as unused: `@mdx-js/react`, `dotenv`, `remark-gfm`, `unist-util-visit`, `reading-time`, `prismjs`, `@mermaid-js/mermaid-cli`, `plugins/`, `scripts/remove-mermaid-svgs.cjs` and the 9 committed `diagrams/*.svg` files. Added `commander` (used by `create-blog-post`; it only worked before because Gatsby installed it).
  - `yarn audit`: 339 vulnerabilities before, 0 after. Fixed by dropping Gatsby, bumping `probe-image-size` to 7.5, refreshing five stale lockfile entries, and a `minimatch` ^11 resolution.
  - CI (`.github/workflows/ci.yml`): `yarn build`, `yarn run check`, `yarn typecheck`, `yarn lint`, `yarn test`, then `yarn test:ci`. `test:ci` runs the specs that only need `baseline.json` (urls, metadata, anchors, links, content, feeds, console, theme, demos) against `astro preview`. `visual.spec.ts` is not run in CI because its screenshots are about 520 MB and gitignored; it and the old-vs-new run stay a local pre-merge check (documented in the README). `yarn check` is a built-in yarn command, so scripts and CI use `yarn run check`.
  - `astro preview` goes to the background when it detects an AI agent, so the Playwright `webServer` command uses `--ignore-lock`.
  - Netlify, checked locally: `netlify dev --dir dist --command "tail -f /dev/null" --offline` applies `_redirects` and `_headers` without logging in. All 14 redirect tests pass against :8888 (`DEPLOY_PREVIEW_URL=http://localhost:8888 npx playwright test --project=new pending`).
  - Redirect tests model Netlify's first-match rule: `pending.spec.ts` expects the earlier rule's target when a later rule has the same path (a no-slash rule also matches the slash path). `_redirects` is unchanged and byte-identical to production.
  - **Likely pre-existing bug in production `_redirects` (for the user to decide):** two rules are unreachable.
    - `/projects/still-cant-explain-album-cover/` (line 12, later rule) was meant to go to `/blog/designing-album-artwork/`. The earlier no-slash rule (line 4) wins, so it goes to `/blog/designing-for-michael-barrow-and-the-tourists/`.
    - `/projects/the-backyard-ep-album-cover/` has two rules. The first (line 13) wins and goes to `/blog/designing-album-artwork/`. The second (line 14), to `/projects/unplugged-album-cover/`, is never reached.
  - Accepted RSS difference: 4 of 40 `content:encoded` excerpts differ slightly from Gatsby (a word or a full stop). Guids, links, titles and pubDates are identical. Also, `<generator>`, `<lastBuildDate>` and CDATA wrappers are gone (the feed is valid XML with escaped text).
  - Verified by a second pass from a fresh `node_modules`: build, `yarn run check`, typecheck, lint, test and `test:ci` (356) pass; `yarn audit` 0; full local old-vs-new parity 544 passed (visual 188/188, feeds 3/3, links 94/94), 15 skipped (14 redirects without a deploy preview, 1 Lighthouse).
  - **Not validated yet (Phase 9):** a real GitHub Actions run, a Netlify deploy preview build, and the `/_astro/*` `Cache-Control` in production (`netlify dev` showed `max-age=0` for a `/_astro/` file but does serve the security headers, so it may override cache headers locally).

## Phase 9: Full regression run, old vs new (0.5-1 day)

Run the whole Playwright suite with `OLD_URL=http://localhost:9000` and `NEW_URL=http://localhost:4321`. Then run it again with `NEW_URL` pointing at the Netlify deploy preview.

| Check         | Passes when                                                                                                                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| URL inventory | Every old URL returns 200 on the new site, with the same trailing slash, and there are no unexpected new pages                                                                                                    |
| Metadata      | Title, description, canonical and OG tags match on every page                                                                                                                                                     |
| Anchors       | Heading ids and footnote ids match on every page                                                                                                                                                                  |
| Links         | Every internal link on the new site works, and the list of outgoing links matches the old site                                                                                                                    |
| Visual        | Screenshots of every page, in light and dark mode, at 1280px and 390px wide, match the old site within a small pixel threshold. Every remaining difference is reviewed and either fixed or added to the allowlist |
| Demos         | Every demo test passes                                                                                                                                                                                            |
| Theme         | The theme tests pass, including the no-flash check                                                                                                                                                                |
| Console       | No console errors or failed requests on any page                                                                                                                                                                  |
| Feeds         | RSS and sitemap match the baseline                                                                                                                                                                                |
| Redirects     | On the deploy preview, each `/projects/*` URL returns a 301 to the same target as before                                                                                                                          |
| Performance   | Lighthouse scores for `/`, an image-heavy post and a demo post are the same as or better than the old site's                                                                                                      |

- **Validate:** the suite is green, someone has reviewed the HTML report, and every visual difference is signed off.

## Phase 10: Cut-over (0.25 day)

- Merge `astra-migration` and watch the production deploy.
- **Validate:**
  - Run the regression suite with `NEW_URL` set to production.
  - Netlify 404s don't spike over the first week.
  - A feed reader doesn't show old posts as new.
- **Rollback:** redeploy the last Gatsby deploy in Netlify, or rebuild from `gatsby-final`.

## After the migration (separate work)

- Tailwind 4 (about 1 day).
- Remove `antlr4ts` if it was replaced.
- After a few weeks, delete the `gatsby-final` worktree but keep the tag.
- About once a year, check how often the Netlify/Vercel adapters and Astro are releasing.
