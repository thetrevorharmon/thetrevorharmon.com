/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require(`path`);
const readingTime = require(`reading-time`);
const {buildReadingList, validateNode} = require('./gatsby-utils');

const REDIRECTS_FOR_RENAMED_PROJECTS = [
  {
    from: '/projects/sweet-honey-cover-art',
    to: '/projects/sweet-honey-album-cover',
  },
  {
    from: '/projects/never-stop-cover-art',
    to: '/projects/never-stop-album-cover',
  },
  {
    from: '/projects/juneau-print-design',
    to: '/projects/juneau-album-art',
  },
];

exports.createPages = async ({graphql, actions}) => {
  const {createPage, createRedirect} = actions;

  REDIRECTS_FOR_RENAMED_PROJECTS.forEach(({from, to}) => {
    createRedirect({
      fromPath: from,
      toPath: to,
    });
  });

  const {data} = await graphql(`
    {
      allMdx {
        nodes {
          slug
          title
          description
          link
          status
          date(formatString: "DD MMM YYYY")
          type
          client
          relatedReading
          includeInReadingList
          image {
            source {
              id
            }
            alt
            attribution {
              author
              sourceName
              sourceUrl
            }
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  function getPath(node) {
    if (node.type === 'Page') {
      return `${node.slug}`;
    }
    const pathPrefix = node.type === 'Post' ? 'blog' : 'projects';

    return `${pathPrefix}/${node.slug}`;
  }

  data.allMdx.nodes.forEach((node, _, nodes) => {
    validateNode(node, nodes);

    const componentPath = path.resolve(`./src/templates/${node.type}.tsx`);
    const contentPath = node.internal.contentFilePath;
    const component = `${componentPath}?__contentFilePath=${contentPath}`;

    const recommendedReading =
      node.type === 'Page' ? [] : buildReadingList(node, nodes);

    createPage({
      path: getPath(node),
      context: {
        slug: node.slug,
        recommendedReading: recommendedReading,
      },
      component: component,
    });
  });
};

exports.onCreateNode = ({node, actions}) => {
  const {createNodeField} = actions;
  if (node.internal.type === `Mdx`) {
    const rawTimeToRead = readingTime(node.body).minutes;
    const roundedTimeToRead = Math.ceil(rawTimeToRead);
    const timeToRead = roundedTimeToRead === 0 ? 1 : roundedTimeToRead;

    createNodeField({
      node,
      name: `timeToRead`,
      value: timeToRead,
    });
  }
};

exports.createSchemaCustomization = ({actions}) => {
  const {createTypes} = actions;

  /*
    This dumps the type defs at this path, useful if you need to alias
    something but want to use the actual type. The file is in the
    .gitignore so it won't ever up in a commit.
    */
  // actions.printTypeDefinitions({path: './.schema-type-definitions'});

  // This proxies all of the frontmatter fields to just live directly
  // on the mdx node
  createTypes(`
    type Mdx implements Node {
      timeToRead: Float @proxy(from: "fields.timeToRead")

      title: String @proxy(from: "frontmatter.title")
      description: String @proxy(from: "frontmatter.description")
      slug: String @proxy(from: "frontmatter.slug")
      link: String @proxy(from: "frontmatter.link")
      status: String @proxy(from: "frontmatter.status")
      relatedReading: [String] @proxy(from: "frontmatter.related_reading")
      includeInReadingList: Boolean @proxy(from: "frontmatter.include_in_reading_list")
      date: Date @dateformat @proxy(from: "frontmatter.date")
      image: MdxFrontmatterImage @proxy(from: "frontmatter.image")

      client: String @proxy(from: "frontmatter.client")
      type: String @proxy(from: "frontmatter.type")
    }
  `);
};

// Silence the conflicting order warning
// https://robertmarshall.dev/blog/fix-warn-chunk-commons-mini-css-extract-plugin-error-in-gatsby-js/
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

exports.onCreateWebpackConfig = ({actions}) => {
  actions.setWebpackConfig({
    plugins: [
      new FilterWarningsPlugin({
        exclude:
          /mini-css-extract-plugin[^]*Conflicting order. Following module has been added:/,
      }),
    ],
  });
};

// This is so I can use ANTLR in Gatsby
// These are polyfills for Node APIs that are no longer included by default
exports.onCreateWebpackConfig = ({actions}) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
        util: require.resolve('util'),
      },
    },
  });
};
