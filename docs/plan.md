# Astro migration plan

These are the tasks for moving this site from Gatsby to Astro 7, start to finish. Each task says how to check that it's done. The background and decisions are in `docs/astro-migration-research.md` and issue #270.

## Ground rules

- Do the work on the `astra-migration` branch. `main` stays on Gatsby until the cut-over.
- **Old** means the Gatsby site from the tag `gatsby-final`. It's built in a separate worktree and served at `http://localhost:9000` (`yarn build && yarn serve`).
- **New** means the Astro site, served with `astro build && astro preview` at `http://localhost:4321`.
- The regression suite (task 1.2) is built first and tested against the old site, so you can trust it before any Astro code exists.
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
- **Validate:** it contains 41 post pages plus `/about/`, `/` and `/blog/`. The number of sitemap entries matches the number of published HTML pages, and there are 41 RSS items.

## Phase 2: Risk test (1 day)

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
- **Validate:** `astro build` and `astro check` pass with a placeholder page.

### 3.2 Content collection

- Create `src/content.config.ts` with the zod schema from #270 and a `glob()` loader over `src/content/blog`.
- Port `validateNode` to `src/lib/`. It runs the checks that span more than one post: the slug equals the filename, and every `related_reading` slug exists.
- Port `buildReadingList` to `src/lib/` too, and fix its existing bug where the "already in curated picks" filter never removes anything.
- **Validate:** all 42 entries load. If you break one frontmatter field on purpose, the build fails with a clear message. For 3 posts with `related_reading`, the curated picks come first.

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

## Phase 5: Layouts, pages and components (2-3 days)

### 5.1 Layouts and head

- Port `Layout`, `PostLayout`, `PageLayout`, `Navbar`, `Footer`, and SEO/meta into `<head>`. Add `<ClientRouter />` to the base layout. `useSiteData` becomes a constant.
- **Validate:** each page's title, description, canonical and OG tags match `baseline.json`.

### 5.2 Pages

- Create `index.astro`, `blog/index.astro`, `blog/[slug].astro`, `[slug].astro` (for the about page), `drafts.astro` and `404.astro`.
- **Validate:** the set of HTML paths in `dist/` is the same as the old site's, apart from the allowed differences. Each type of page looks right on desktop and mobile.

### 5.3 Components

- Rebuild `Callout`, `TwoUp`, `Citation`, `Breakout` and `Link` as `.astro` components, and pass them to MDX through `components`.
- Rewrite `Link`/`Button` without Gatsby, and `Image` and the featured image with `astro:assets`.
- Port the SVG icons, `PostTile`, `FeaturedTile` and `ReadingList`.
- **Validate:** screenshots of the 12 MDX posts that use these components match the old ones.

## Phase 6: Markdown on Sätteri (1-1.5 days)

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

- Write a custom Sätteri plugin that produces `footnote--x` / `reference--x` ids and the arrow icon.
- **Validate:** footnote ids and hrefs match the baseline on every page. Clicking a footnote, and then its back arrow, scrolls to the right place.

### 6.3 Mermaid

- Use `@xingwangzhe/satteri-mermaid`, or the fallback plugin that inserts the committed SVGs, depending on what Phase 2 found.
- **Validate:** all 9 diagrams render in light and dark mode. After a visual review signs them off, add them to the allowlist.

### 6.4 Images

- Run markdown images through `astro:assets`, and handle the 4 gifs, the featured images and the OG image URL.
- **Validate:** each page has the same image count and alt text as the baseline. The gifs still animate (they have more than one frame). OG image URLs return 200.

## Phase 7: Interactive demos (1 day, +1 if switching to `antlr4ng`)

### 7.1 Demo posts

- Add `client:load` to the demo components in the 6 posts, and change type-only imports to `import type`.
- For ANTLR, add Vite polyfills for `assert`/`buffer`/`util`, or switch to `antlr4ng`.
- **Validate (Playwright, one test per demo):**
  - The editor loads.
  - Typing produces the expected change, such as a decoration, a lint marker, tokens or synced state.
  - There are no console errors.
  - It still works after navigating away and back with ClientRouter.
  - The editor follows theme changes.

## Phase 8: Generated files, cleanup and CI (0.5-1 day)

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

- Remove the Gatsby dependencies, the `gatsby-*` files, `gatsby-types.d.ts`, `graphql.config.js` and `netlify-plugin-cache`.
- Update the `package.json` scripts (`develop`, `build`, `serve`, `tophat`), `netlify.toml` (`dist/`), the README, the PR template and the Dependabot ignores.
- Set CI to run the build, `astro check`, lint and the Playwright suite against the new build.
- **Validate:** the `yarn audit` count is near zero (write the number down). CI is green, and a Netlify deploy preview builds.

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
