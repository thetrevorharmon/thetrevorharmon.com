# Astro migration research

**Status:** research only. Nothing has been migrated yet. Last updated 2026-10-31.

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

**Watch out:** `@xingwangzhe/satteri-mermaid` 0.8.2 only works with `satteri` 0.10.x. Astro 7.4.4 uses `satteri ^0.10.5`, so it works today. If Astro moves to Sätteri 0.11, the plugin needs an update first.

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

## Untested risks

| #   | What                                                          | If it fails                                                 |
| --- | ------------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | The ANTLR/Zephyr editor under Vite                            | +1 day for `antlr4ng`, or show those 2 posts as static code |
| 2   | Demos working in a browser, and `<ClientRouter />` page swaps | Fix how they restart, or drop ClientRouter and use prefetch |
| 3   | Footnote ids on Sätteri                                       | Write a bigger custom plugin                                |
| 4   | `satteri-mermaid` on the 9 diagrams                           | Use the custom plugin with the committed SVGs               |
| 5   | Prism on Sätteri matching `syntaxHighlighting.scss`           | Restyle, or use Expressive Code                             |
| 6   | Tailwind 3 + SCSS on Vite 8                                   | Small config fixes                                          |
| 7   | Heading anchors matching                                      | Adjust the plugin options                                   |
| 8   | Images: optimization, the 4 gifs, captions, featured/OG image | Custom caption plugin, or move the gifs to `public/`        |
| 9   | RSS and sitemap matching                                      | Adjust the RSS endpoint                                     |

**Next step:** a one-day test on a branch covering items 1-5. Build one demo post, the ANTLR post, a footnote post and a mermaid post with Sätteri, and click through them in a browser. If those pass, follow the full staged plan in #270.

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
