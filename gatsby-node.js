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
