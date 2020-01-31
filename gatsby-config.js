// to separate development & production variables, refer to:
// https://github.com/gatsbyjs/gatsby/blob/master/docs/docs/environment-variables.md

let environment =
  process.env.ACTIVE_ENV || process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: `.env.${environment}`,
});

const Utils = require('./gatsby-utils');

module.exports = {
  siteMetadata: {
    title: `The Trevor Harmon`,
    tagline: `I write code for Shopify, and (sometimes) write things on my blog.`,
    description: `The blog & portfolio of Trevor Harmon.`,
    siteUrl: `https://thetrevorharmon.com`,
    feedUrl: `https://thetrevorharmon.com/rss.xml`,
    mailchimpFallbackUrl: process.env.MAILCHIMP_FORM_FALLBACK_URL,
    author: 'Trevor Harmon',
    twitter: {
      author: '@thetrevorharmon',
      site: '@thetrevorharmon',
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        host:
          environment === 'development' ? `preview.contentful.com` : undefined,
      },
    },
    `gatsby-plugin-typescript`,
    `gatsby-plugin-tslint`,
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        cssLoaderOptions: {
          camelCase: false,
        },
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: './static/favicon.png',
        background: 'transparent',
        version: '2.0',
        icons: {
          appleStartup: false,
        },
      },
    },
    `gatsby-plugin-react-svg`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-robots-txt`,
    `gatsby-plugin-sharp`, // for gatsby-image
    `gatsby-transformer-sharp`, // for gatsby-image,
    {
      resolve: 'gatsby-plugin-mailchimp',
      options: {
        endpoint: process.env.MAILCHIMP_ACTION_URL,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-prismjs`, // for code highlighting
          {
            // This plugin was causing me grief previously 👇
            // https://github.com/gatsbyjs/gatsby/issues/11867
            resolve: `gatsby-remark-images-contentful`,
            options: {
              maxWidth: 800,
              linkImagesToOriginal: false,
              backgroundColor: `transparent`,
              withWebp: true,
            },
          },
        ],
      },
    },
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
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        feeds: [
          {
            serialize: ({
              query: {site, allContentfulBlogPost, allContentfulLinkPost},
            }) => {
              const posts = Utils.combinePostTypes(
                allContentfulBlogPost.nodes,
                allContentfulLinkPost.nodes,
              );

              return posts.map((post) => {
                return Object.assign(
                  {},
                  {
                    title: post.title,
                    description: post.description
                      ? post.description
                      : post.body.childMarkdownRemark.excerpt,
                    date: post.date,
                    url: site.siteMetadata.siteUrl + '/blog/' + post.slug,
                    guid: site.siteMetadata.siteUrl + '/blog/' + post.slug,
                    custom_elements: [
                      {'content:encoded': post.body.childMarkdownRemark.html},
                    ],
                  },
                );
              });
            },
            query: `
              {
                allContentfulBlogPost(
                  limit: 1000,
                  sort: { order: DESC, fields: [date] },
                ) {
                  nodes {
                    title
                    slug
                    description
                    date
                    body {
                      childMarkdownRemark {
                        html
                        excerpt
                      }
                    }
                  }
                }
                allContentfulLinkPost(
                  limit: 1000,
                  sort: { order: DESC, fields: [date] },
                ) {
                  nodes {
                    title
                    slug
                    date
                    body {
                      childMarkdownRemark {
                        html
                        excerpt
                      }
                    }
                  }
                }
              }              
            `,
            output: '/rss.xml',
            title: "Trevor Harmon's Blog",
          },
        ],
      },
    },
  ],
};
