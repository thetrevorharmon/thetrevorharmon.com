# thetrevorharmon.com

Hi there! 👋 This is the repo for my blog & portfolio site. It's built on [Gatsby](https://www.gatsbyjs.com) 5 with React 19 and written in TypeScript. Styling is Tailwind CSS 3 plus Sass, and content is MDX files in `src/content` (via `gatsby-plugin-mdx`). The site is hosted on Netlify. 💪

## Getting Started

You need Node 22 (see `.nvmrc`) and [Yarn 1](https://classic.yarnpkg.com/).

1. `nvm use` (or `nvm install` the first time).
1. `yarn install`.
1. `yarn start`.

That's it! The site runs at http://localhost:8000.

## Scripts

- `yarn start` / `yarn develop`: run the dev server (`yarn broadcast` exposes it on your network).
- `yarn build`: production build into `public/`.
- `yarn serve`: serve the production build locally.
- `yarn clean`: clear the Gatsby `.cache` and `public/`.
- `yarn typecheck`: run `tsc --noEmit`.
- `yarn lint`: run ESLint.
- `yarn pretty`: format with Prettier.
- `yarn tophat`: clean, build and serve, to check a production build locally.
- `yarn create-blog-post`: scaffold a new post (see `src/content/README.md`).

## Continuous integration

GitHub Actions (`.github/workflows/ci.yml`) runs `yarn typecheck`, `yarn lint` and `yarn build` on every pull request and on pushes to `main`. Dependabot (`.github/dependabot.yml`) opens weekly grouped dependency updates. A few packages are deliberately held back; the reasons are commented in that file.

## Hosting

[![Netlify Status](https://api.netlify.com/api/v1/badges/38e3f6ce-6719-49f4-b18a-0528ed0a971a/deploy-status)](https://app.netlify.com/sites/thetrevorharmon/deploys)

This site has a continuous deployment set up with Netlify. Any time there is a change to main, Netlify will automatically redeploy the site (usually takes <7 minutes).
