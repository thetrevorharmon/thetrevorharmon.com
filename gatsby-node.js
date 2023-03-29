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
        allContentfulProject(sort: {projectCompletionDate: DESC}) {
          nodes {
            title
            slug
            projectCompletionDate(formatString: "DD MMM YYYY")
            internal {
              type
            }
          }
        }
        allContentfulBlogPost(sort: {date: DESC}) {
          nodes {
            title
            slug
            date(formatString: "DD MMM YYYY")
            internal {
              type
            }
          }
        }
        allContentfulLinkPost(sort: {date: DESC}) {
          nodes {
            title
            slug
            date(formatString: "DD MMM YYYY")
            internal {
              type
            }
          }
        }
        allMdx {
          nodes {
            slug
            title
            description
            link
            date
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
      result.data.allMdx.nodes.forEach((node) => {
        const name = node.internal.contentFilePath;

        class NodeError extends Error {
          constructor(message) {
            super(`${message}\n\n${name}`);
          }
        }

        function enforcePostFields(node) {
          if (node.title == null || node.title == '') {
            throw new NodeError(`Must include title`);
          }

          if (node.slug == null) {
            throw new NodeError(`Must include slug`);
          }

          if (node.description == null && node.link == null) {
            throw new NodeError(`Must include description or link`);
          }

          if (node.date == null) {
            throw new NodeError(`Must include date`);
          }

          if (node.image != null) {
            if (node.image.source == null || node.image.alt == null) {
              throw new NodeError(
                `Must include source, alt if an image is passed`,
              );
            }

            if (node.image.attribution != null) {
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
        }

        function enforceProjectFields(node) {
          if (node.title == null || node.title == '') {
            throw new NodeError(`Must include title`);
          }

          if (node.slug == null) {
            throw new NodeError(`Must include slug`);
          }

          if (node.date == null) {
            throw new NodeError(`Must include date`);
          }

          if (node.client == null) {
            throw new NodeError(`Must include client`);
          }

          if (node.type !== 'Project') {
            throw new NodeError(`Must format type to be exactly Project`);
          }
        }

        if (node.type && node.type.toLowerCase() === 'project') {
          enforceProjectFields(node);
        } else {
          enforcePostFields(node);
        }

        const fileName = node.internal.contentFilePath
          .split('/')
          .slice(-1)
          .pop()
          .split(/\.mdx?/)[0];

        if (fileName !== node.slug) {
          throw new Error(
            `Slug and file name must match\n${fileName}\n${slug}`,
          );
        }

        const articlePath = path.resolve(`./src/templates/Article.tsx`);
        const contentPath = node.internal.contentFilePath;
        const component = `${articlePath}?__contentFilePath=${contentPath}`;

        createPage({
          path: `blog-next/${node.slug}`,
          context: {
            slug: node.slug,
          },
          component: component,
        });
      });

      result.data.allContentfulProject.nodes.forEach((project, _, projects) => {
        const recommendedProjects = Utils.getRecommendedItems(
          project,
          projects,
          'projectCompletionDate',
        );

        createPage({
          path: `projects/${project.slug}`,
          component: path.resolve(
            Utils.pathTemplateForPostType(project.internal.type),
          ),
          context: {
            slug: project.slug,
            recommendedProjects: recommendedProjects,
          },
        });
      });

      Utils.combinePostTypes(
        result.data.allContentfulBlogPost.nodes,
        result.data.allContentfulLinkPost.nodes,
      ).forEach((post, _, posts) => {
        const recommendedPosts = Utils.getRecommendedItems(post, posts, 'date');

        createPage({
          path: `blog/${post.slug}`,
          component: path.resolve(
            Utils.pathTemplateForPostType(post.internal.type),
          ),
          context: {
            slug: post.slug,
            recommendedPosts: recommendedPosts,
          },
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
      timeToRead: MdxFieldsTimeToRead @proxy(from: "fields.timeToRead")

      title: String @proxy(from: "frontmatter.title")
      description: String @proxy(from: "frontmatter.description")
      slug: String @proxy(from: "frontmatter.slug")
      link: String @proxy(from: "frontmatter.link")
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
