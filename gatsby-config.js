// to separate development & production variables, refer to:
// https://github.com/gatsbyjs/gatsby/blob/master/docs/docs/environment-variables.md

require("dotenv").config({path: `.env`,})
let isDevelopment = (process.env.ACTIVE_ENV || process.env.NODE_ENV) === 'development';

module.exports = {
  siteMetadata: {
    title: `The Trevor Harmon`,
    tagline: `I’ve been doing design & development work for about ten years. I love building beautiful, usable things.`,
    description: `This is the portfolio site for all of the design and development work of Trevor Harmon.`,
  },
  plugins: [
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: isDevelopment ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
        host: isDevelopment ?`preview.contentful.com` : undefined,
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
    `gatsby-plugin-sharp`, // for gatsby-img
    `gatsby-transformer-sharp`, // for gatsby-img
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
        // Puts tracking script in the head instead of the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
        // Any additional create only fields (optional)
        sampleRate: 5,
        siteSpeedSampleRate: 10,
        cookieDomain: "thetrevorharmon.com",
      },
    },
  ],
}
