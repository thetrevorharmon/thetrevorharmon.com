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
    author: 'Trevor Harmon',
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
    `gatsby-transformer-sharp`, // for gatsby-image,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-embed-gist`, // for embedding gists
          `gatsby-remark-prismjs`, // for code highlighting
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
            serialize: ({ query: { site, allContentfulBlogPost } }) => {
              return allContentfulBlogPost.edges.map(edge => {
                return Object.assign({}, {
                  title: edge.node.title,
                  description: edge.node.description.description,
                  date: edge.node.publishDate,
                  url: site.siteMetadata.siteUrl + '/blog/' + edge.node.slug,
                  guid: site.siteMetadata.siteUrl + '/blog/' + edge.node.slug,
                  // custom_elements: [{ "content:encoded": "<p>THIS IS A TEST</p>" }],
                  custom_elements: [{ "content:encoded": edge.node.body.childMarkdownRemark.html }],
                })
              })
            },
            query: `
              {
                allContentfulBlogPost {
                  edges {
                    node {
                      title
                      slug
                      description {
                        description
                      }
                      publishDate(formatString: "YYYY-MM-DD")
                      body {
                        body
                        childMarkdownRemark {
                          html
                          timeToRead
                        }
                      }
                      tags
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Gatsby RSS Feed",
          }
        ]
      }
    },

    // {
    //   resolve: 'gatsby-plugin-feed-generator',
    //   options: {
    //     generator: `GatsbyJS`,
    //     rss: true, // Set to false to stop rss generation
    //     json: true, // Set to false to stop json feed generation
    //     siteQuery: `
    //       {
    //         site {
    //           siteMetadata {
    //             title
    //             description
    //             siteUrl
    //             author
    //           }
    //         }
    //       }
    //     `,
    //     // The plugin requires frontmatter of date, path(or slug/url), and title at minimum
    //     feedQuery: `
          // {
          //   allMarkdownRemark( filter: {frontmatter: {date: {ne: null}}}) {
          //     edges {
          //       node {
          //         html
          //         frontmatter {
          //           title
          //           description
          //           slug
          //           date
          //         }
          //       }
          //     }
          //   }
          // }
    //     `
    //   }
    // }    
  ],
}
