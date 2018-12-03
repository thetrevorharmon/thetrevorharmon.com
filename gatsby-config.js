// to separate development & production variables, refer to:
// https://github.com/gatsbyjs/gatsby/blob/master/docs/docs/environment-variables.md

let environment = process.env.ACTIVE_ENV || process.env.NODE_ENV || 'development';
require("dotenv").config({
  path: `.env.${environment}`,
});

module.exports = {
  siteMetadata: {
    title: `The Trevor Harmon`,
    tagline: `I’ve been doing design & development work for about ten years. I love building beautiful, usable things.`,
    description: `This is the portfolio site for all of the design and development work of Trevor Harmon.`,
    siteUrl: `https://thetrevorharmon.com`,
  },
  plugins: [
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        host: environment === 'development' ? `preview.contentful.com` : undefined,
      },
    },
    {
      resolve: `gatsby-source-medium`,
      options: {
        username: `@thetrevorharmon`,
        limit: 10,
      },
    },
    `gatsby-plugin-typescript`,
    `gatsby-plugin-tslint`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-favicon`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-sharp`, // for gatsby-image
    `gatsby-transformer-sharp`, // for gatsby-image
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
        head: true, // Puts tracking script in the head instead of the body
        anonymize: true,
        respectDNT: true,
        cookieDomain: `thetrevorharmon.com`,
      },
    },
  ],
}
