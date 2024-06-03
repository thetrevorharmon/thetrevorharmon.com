import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import tailwindCss from 'tailwindcss';
import remarkGfm from 'remark-gfm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const environment =
  process.env.ACTIVE_ENV ?? process.env.NODE_ENV ?? 'development';

dotenv.config({
  path: `.env.${environment}`,
});

const config = {
  siteMetadata: {
    title: `The Trevor Harmon`,
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
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/',
      },
      __key: 'images',
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/src/content/blog`,
      },
      __key: 'blog',
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/src/content/projects`,
      },
      __key: 'projects',
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/content/pages`,
      },
      __key: 'pages',
    },
    'gatsby-plugin-netlify',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        mdxOptions: {
          // remarkGfm adds support for github flavored markdown
          // to MDX. Footnotes, tables, tasklists, etc are all
          // supported by remarkGfm.
          remarkPlugins: [remarkGfm],
        },
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
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              // This icon is the same icon at ./src/components/Icon/icons/link.svg
              // Unfortunately, I can't import it from there because of the way the
              // bundling is set up.
              icon: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" width="24" height="24"><defs><style>.cls-6374f8d9b67f094e4896c620-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}</style></defs><path class="cls-6374f8d9b67f094e4896c620-1" d="M9.14,7.23A4.76,4.76,0,0,1,13,5.32h4.78a4.77,4.77,0,1,1,0,9.54H13a4.77,4.77,0,0,1-4.67-3.81"></path><path class="cls-6374f8d9b67f094e4896c620-1" d="M15.72,13a4.77,4.77,0,0,0-4.67-3.81H6.27a4.77,4.77,0,0,0,0,9.54h4.78a4.76,4.76,0,0,0,3.37-1.39,3.57,3.57,0,0,0,.44-.52"></path></svg>`,
              className: `header-link`,
              elements: ['h2', 'h3', 'h4', 'h5'],
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
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [tailwindCss],
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
      resolve: `gatsby-plugin-feed`,
      options: {
        feeds: [
          {
            serialize: ({
              query: { site, allMdx },
            }) => {
              return allMdx.nodes.map((node) => ({
                title: node.title,
                description: node.description ? node.description : node.excerpt,
                date: node.date,
                url: site.siteMetadata.siteUrl + '/blog/' + node.slug,
                guid: site.siteMetadata.siteUrl + '/blog/' + node.slug,
                custom_elements: [{ 'content:encoded': node.excerpt }],
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
