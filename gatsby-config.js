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
    feedUrl: `https://thetrevorharmon.com/rss.xml`,
    mailchimpFallbackUrl: process.env.MAILCHIMP_FORM_FALLBACK_URL,
    author: 'Trevor Harmon',
    twitter: {
      author: '@thetrevorharmon',
      site: '@thetrevorharmon',
    }
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
    `gatsby-plugin-typescript`,
    `gatsby-plugin-tslint`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./static/favicon.png",
        icons: {
          appleStartup: false,
        }
      }
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
          `gatsby-remark-embed-gist`, // for embedding gists
          `gatsby-remark-prismjs`, // for code highlighting
          {
            resolve: `gatsby-remark-images-contentful`,
            options: {
              maxWidth: 800,
              linkImagesToOriginal: false,
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
            serialize: ({ query: { site, allContentfulBlogPost, allContentfulLinkPost } }) => {
              // This combines blog posts and link posts into a single array of posts
              // First combines and then sorts according to date (newest first)
              const combinePostTypes = (blogPosts, linkPosts, order = 'desc') => {
                const orderMultiplier = order === 'desc' ? 1 : -1;

                const posts = [
                  // blog posts
                  ...blogPosts.edges.map((edge) => edge.node),
                  // link posts
                  ...linkPosts.edges.map((edge) => edge.node),
                ].sort(
                  (firstDate, secondDate) => {
                    const a = new Date(firstDate.date);
                    const b = new Date(secondDate.date);

                    if (a < b) { return 1 * orderMultiplier; }
                    if (a > b) { return -1 * orderMultiplier; }

                    return 0;
                  },
                );

                return posts;
              }

              const posts = combinePostTypes(allContentfulBlogPost, allContentfulLinkPost);

              return posts.map(post => {
                return Object.assign({}, {
                  title: post.title,
                  description: post.description ? post.description : post.body.childMarkdownRemark.excerpt,
                  date: post.date,
                  url: site.siteMetadata.siteUrl + '/blog/' + post.slug,
                  guid: site.siteMetadata.siteUrl + '/blog/' + post.slug,
                  custom_elements: [{ "content:encoded": post.body.childMarkdownRemark.html }],
                })
              })
            },
            query: `
              {
                allContentfulBlogPost(
                  limit: 1000,
                  sort: { order: DESC, fields: [date] },
                ) {
                  edges {
                    node {
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
                }
                allContentfulLinkPost(
                  limit: 1000,
                  sort: { order: DESC, fields: [date] },
                ) {
                  edges {
                    node {
                      title
                      slug
                      # add description back in when needed
                      # description
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
              }              
            `,
            output: "/rss.xml",
            title: "Trevor Harmon's Blog RSS Feed",
          }
        ]
      }
    },   
  ],
}
