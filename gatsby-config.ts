import type {GatsbyConfig} from 'gatsby';
import dotenv from 'dotenv';

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
    author: 'Trevor Harmon',
    twitterHandle: '@thetrevorharmon',
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-netlify',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    `gatsby-transformer-remark`,
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
              showCaptions: ['title'],
            },
          },
          {
            resolve: `gatsby-remark-mermaid-to-svg`,
            options: {
              mermaidOptions: {
                themeVariables: {
                  fontFamily:
                    'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                },
              },
            },
          },
          `gatsby-remark-prismjs`,
          // this is to handle inline gifs
          // https://github.com/gatsbyjs/gatsby/issues/7317#issuecomment-412984851
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-external-links`,
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/src/content/blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/src/content/projects`,
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [require('tailwindcss')],
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
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/favicon.png',
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
              query: {site, allMdx},
            }: {
              query: {
                site: {
                  siteMetadata: SiteMetadata;
                };
                allMdx: {
                  nodes: Mdx[];
                };
              };
            }) => {
              return allMdx.nodes.map((node: Mdx) => ({
                title: node.title,
                description: node.description ? node.description : node.excerpt,
                date: node.date,
                url: site.siteMetadata.siteUrl + '/blog/' + node.slug,
                guid: site.siteMetadata.siteUrl + '/blog/' + node.slug,
                custom_elements: [{'content:encoded': node.excerpt}],
              }));
            },
            query: `
              query RssFeed {
                  allMdx(
                    sort: {date: DESC}
                    filter: {type: {eq: "Post"}, status: {eq: "Published"}}
                    limit: 1000
                  ) {
                  nodes {
                    slug
                    title
                    description
                    excerpt
                    link
                    date(formatString: "DD MMM YYYY")
                    internal {
                      contentFilePath
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
