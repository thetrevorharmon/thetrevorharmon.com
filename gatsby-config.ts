import type {GatsbyConfig} from 'gatsby';
import dotenv from 'dotenv';

const Utils = require('./gatsby-utils');

const environment =
  process.env.ACTIVE_ENV ?? process.env.NODE_ENV ?? 'development';

dotenv.config({
  path: `.env.${environment}`,
});

const config: GatsbyConfig = {
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
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: 'gatsby-source-contentful',
      options: {
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        host:
          process.env.NODE_ENV === 'development'
            ? 'preview.contentful.com'
            : undefined,
      },
    },
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
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
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
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
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/src/blog`,
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [require('tailwindcss')],
      },
    },
    {
      resolve: 'gatsby-plugin-mailchimp',
      options: {
        endpoint: process.env.MAILCHIMP_ACTION_URL,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [process.env.GOOGLE_ANALYTICS_TRACKING_ID],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        // gtagConfig: {
        //   optimize_id: 'OPT_CONTAINER_ID',
        //   anonymize_ip: true,
        //   cookie_expires: 0,
        // },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: false,
          // Setting this parameter is also optional
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          // exclude: ['/preview/**', '/do-not-track/me/too/'],
          // Defaults to https://www.googletagmanager.com
          origin: 'https://www.thetrevorharmon.com',
          // Delays processing pageview events on route update (in milliseconds)
          delayOnRouteUpdate: 0,
        },
      },
    },
    `gatsby-plugin-react-svg`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-robots-txt`,
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/',
      },
      __key: 'images',
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        feeds: [
          {
            serialize: ({
              query: {site, allContentfulBlogPost, allContentfulLinkPost},
            }: {
              query: {
                site: any;
                allContentfulBlogPost: any;
                allContentfulLinkPost: any;
              };
            }) => {
              const posts = Utils.combinePostTypes(
                allContentfulBlogPost.nodes,
                allContentfulLinkPost.nodes,
              );

              return posts.map((post: any) => {
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

export default config;
