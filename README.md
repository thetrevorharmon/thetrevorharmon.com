# thetrevorharmon.com

Hi there! 👋 This is the repo for my blog & portfolio site. It's built on [Astro](https://astro.build) 7 with React 19 islands and written in TypeScript. Styling is Tailwind CSS 3 plus Sass, and content is Markdown and MDX files in `src/content` (rendered with Sätteri). The site is hosted on Netlify. 💪

## Getting Started

You need Node 22 (see `.nvmrc`) and [Yarn 1](https://classic.yarnpkg.com/).

1. `nvm use` (or `nvm install` the first time).
1. `yarn install`.
1. `yarn start`.

That's it! The site runs at http://localhost:4321.

## Scripts

- `yarn start` / `yarn dev`: run the dev server (`yarn broadcast` exposes it on your network).
- `yarn build`: production build into `dist/`.
- `yarn preview`: serve the production build locally.
- `yarn clean`: remove `.astro/` and `dist/`.
- `yarn tophat`: clean, build and preview, to check a production build locally.
- `yarn run check`: run `astro check` (use `yarn run`; plain `yarn check` is a built-in yarn command).
- `yarn typecheck`: run `tsc --noEmit`.
- `yarn lint`: run ESLint.
- `yarn test`: run the unit tests.
- `yarn pretty`: format with Prettier.
- `yarn create-blog-post`: scaffold a new post (see `src/content/README.md`).

## Continuous integration

GitHub Actions (`.github/workflows/ci.yml`) runs `yarn build`, `yarn run check`, `yarn typecheck`, `yarn lint` and `yarn test` on every pull request and on pushes to `main`. Dependabot (`.github/dependabot.yml`) opens weekly grouped dependency updates. A few packages are deliberately held back; the reasons are commented in that file.

## Hosting

[![Netlify Status](https://api.netlify.com/api/v1/badges/38e3f6ce-6719-49f4-b18a-0528ed0a971a/deploy-status)](https://app.netlify.com/sites/thetrevorharmon/deploys)

This site has a continuous deployment set up with Netlify. Any time there is a change to main, Netlify will automatically redeploy the site (usually takes <7 minutes).
