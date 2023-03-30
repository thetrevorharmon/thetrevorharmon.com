/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require(`path`);
const readingTime = require(`reading-time`);
const Utils = require('./gatsby-utils');

exports.createPages = ({graphql, actions}) => {
  const {createPage} = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMdx {
          nodes {
            slug
            title
            description
            link
            date(formatString: "DD MMM YYYY")
            type
            client
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
    `).then((result) => {
      result.data.allMdx.nodes.forEach((node, _, nodes) => {
        const name = node.internal.contentFilePath;

        class NodeError extends Error {
          constructor(message) {
            super(`${message}\n\n${name}`);
          }
        }

        function enforceNodeFields(node) {
          const fileName = node.internal.contentFilePath
            .split('/')
            .slice(-1)
            .pop()
            .split(/\.mdx?/)[0];

          if (fileName !== node.slug) {
            throw new NodeError(`Slug and file name must match`);
          }

          if (node.type == null) {
            throw new NodeError('Must include a type');
          }

          if (!['Project', 'Post'].includes(node.type)) {
            throw new NodeError(
              `Encountered ${node.type} as the node type–must include one of the following types (case sensistive): Post, Project`,
            );
          }

          if (node.title == null || node.title == '') {
            throw new NodeError(`Must include title`);
          }

          if (node.slug == null) {
            throw new NodeError(`Must include slug`);
          }

          if (node.date == null) {
            throw new NodeError(`Must include date`);
          }

          if (
            node.image != null &&
            (node.image.source == null || node.image.alt == null)
          ) {
            throw new NodeError(
              `Must include source, alt if an image is passed`,
            );
          }

          if (node.type === 'Post') {
            enforcePostFields(node);
          } else {
            enforceProjectFields(node);
          }
        }

        function enforcePostFields(node) {
          if (node.description == null && node.link == null) {
            throw new NodeError(`Must include description or link`);
          }

          if (node.image != null && node.image.attribution != null) {
            if (
              node.image.attribution.author == null ||
              node.image.attribution.sourceName == null ||
              node.image.attribution.sourceUrl == null
            ) {
              throw new NodeError(
                `Must include author, sourceName, sourceUrl if an image attribution is passed`,
              );
            }
          }
        }

        function enforceProjectFields(node) {
          if (node.client == null) {
            throw new NodeError(`Must include client`);
          }
        }

        enforceNodeFields(node);

        const componentPath = path.resolve(`./src/templates/${node.type}.tsx`);
        const contentPath = node.internal.contentFilePath;
        const component = `${componentPath}?__contentFilePath=${contentPath}`;

        const pathPrefix = node.type === 'Post' ? 'blog' : 'projects';

        const recommendedNodes = Utils.getRecommendedItems(
          node,
          nodes.filter((currentNode) => currentNode.type === node.type),
          'date',
        );

        createPage({
          path: `${pathPrefix}/${node.slug}`,
          context: {
            slug: node.slug,
            recommendedReading: recommendedNodes,
          },
          component: component,
        });
      });

      resolve();
    });
  });
};

exports.onCreateNode = ({node, actions}) => {
  const {createNodeField} = actions;
  if (node.internal.type === `Mdx`) {
    createNodeField({
      node,
      name: `timeToRead`,
      value: readingTime(node.body),
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
      timeToRead: Float @proxy(from: "fields.timeToRead.minutes")

      title: String @proxy(from: "frontmatter.title")
      description: String @proxy(from: "frontmatter.description")
      slug: String @proxy(from: "frontmatter.slug")
      link: String @proxy(from: "frontmatter.link")
      status: String @proxy(from: "frontmatter.status")
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
