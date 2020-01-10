/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require(`path`);
const Utils = require('./gatsby-utils');

exports.createPages = ({graphql, actions}) => {
  const {createPage} = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allContentfulProject(
          sort: {order: DESC, fields: [projectCompletionDate]}
        ) {
          nodes {
            title
            slug
            projectCompletionDate(formatString: "DD MMM YYYY")
            internal {
              type
            }
          }
        }
        allContentfulBlogPost(sort: {order: DESC, fields: [date]}) {
          nodes {
            title
            slug
            date(formatString: "DD MMM YYYY")
            internal {
              type
            }
          }
        }
        allContentfulLinkPost(sort: {order: DESC, fields: [date]}) {
          nodes {
            title
            slug
            date(formatString: "DD MMM YYYY")
            internal {
              type
            }
          }
        }
      }
    `).then((result) => {
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

// got this from https://spectrum.chat/gatsby-js/general/having-issue-related-to-chunk-commons-mini-css-extract-plugin~0ee9c456-a37e-472a-a1a0-cc36f8ae6033
// this silences false errors that have to do with import errors with CSS modules
// see this issue for more info: https://github.com/facebook/create-react-app/issues/5372
exports.onCreateWebpackConfig = ({stage, actions, getConfig}) => {
  if (stage === 'build-javascript') {
    const config = getConfig();
    const miniCssExtractPlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin',
    );
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }
    actions.replaceWebpackConfig(config);
  }
};
