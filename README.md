# thetrevorharmon.com

Hi there! 👋 This is my blog & portfolio site. It's built on [Gatsby](https://gatsby.org) and written in Typescript, with the styling done in SASS modules. The data is living in Contentful, a headless CMS, and is pulled at build-time. The site is hosted on Netlify. 💪

## Getting Started

Getting started with this repo is fairly straightforward:

1. Go to Contentful, Mailchimp, and Google Analytics to find all the necessary pieces for your .env file.
2. Create two .env files: `.env.development` and `.env.production`. Stick the _preview_ Contentful token in the `.env.development` file, and stick the normal one in the prod file. You can refer to `.env.sample` to know what you need to find.
3. Run `yarn install`.
4. Run `yarn start`.

That's it!

## Hosting

[![Netlify Status](https://api.netlify.com/api/v1/badges/c6ab75d8-c5c5-4237-9ae8-c2320b3e7cac/deploy-status)](https://app.netlify.com/sites/thetrevorharmon/deploys)

This site has a continuous deployment set up with Netlify. Any time there is a change to master, Netlify will automatically redeploy the site (usually takes <7 minutes).
