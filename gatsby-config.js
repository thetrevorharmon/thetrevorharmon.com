// to separate development & production variables, refer to:
// https://github.com/gatsbyjs/gatsby/blob/master/docs/docs/environment-variables.md

require("dotenv").config({path: `.env`,})

module.exports = {
  siteMetadata: {
    siteName: `The Trevor Harmon`,
    tagline: `I’ve been doing design & development work for about ten years. I love building beautiful, usable things.`,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-tslint`,
    `gatsby-plugin-sass`,
    `gatsby-transformer-remark`, // this converts .md to .html
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      },
    },
    {
      resolve: `gatsby-source-medium`,
      options: {
        username: `@thetrevorharmon`,
        limit: 200,
      },
    },
  ],
}
