/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require(`path`);

// This combines blog posts and link posts into a single array of posts
// First combines and then sorts according to date (newest first)
const combinePostTypes = (blogPosts, linkPosts, order = 'desc') => {
  const orderMultiplier = order === 'desc' ? 1 : -1;

  const posts = [
    // blog posts
    ...blogPosts.edges.map((edge) => edge.node),
    // link posts
    ...linkPosts.edges.map((edge) => edge.node),
  ].sort((firstDate, secondDate) => {
    const a = new Date(firstDate.date);
    const b = new Date(secondDate.date);

    if (a < b) {
      return 1 * orderMultiplier;
    }
    if (a > b) {
      return -1 * orderMultiplier;
    }

    return 0;
  });

  return posts;
};

// Given a type, this returns the location of the template for the type
// It throws an error when it encounters a type that doesn't exist
const pathTemplateForPostType = (type) => {
  const paths = {
    ContentfulBlogPost: `./src/templates/post/blog/blogPostTemplate.tsx`,
    ContentfulLinkPost: `./src/templates/post/blog/linkPostTemplate.tsx`,
    ContentfulProject: `./src/templates/project/projectTemplate.tsx`,
    ContentfulCaseStudy: `./src/templates/post/caseStudy/caseStudyTemplate.tsx`,
  };

  if (!paths[type]) {
    throw new Error(`Cannot find template path for type: ${type}`);
  }

  return paths[type];
};

exports.createPages = ({graphql, actions}) => {
  const {createPage} = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allContentfulProject {
          edges {
            node {
              title
              slug
              internal {
                type
              }
            }
          }
        }
        allContentfulCaseStudy {
          edges {
            node {
              title
              slug
              internal {
                type
              }
            }
          }
        }
        allContentfulBlogPost(sort: {order: DESC, fields: [date]}) {
          edges {
            node {
              title
              slug
              internal {
                type
              }
            }
          }
        }
        allContentfulLinkPost(sort: {order: DESC, fields: [date]}) {
          edges {
            node {
              title
              slug
              internal {
                type
              }
            }
          }
        }
      }
    `).then((result) => {
      result.data.allContentfulProject.edges.forEach(({node}) => {
        createPage({
          path: `projects/${node.slug}`,
          component: path.resolve(pathTemplateForPostType(node.internal.type)),
          context: {
            slug: node.slug,
          },
        });
      });
      result.data.allContentfulCaseStudy.edges.forEach(({node}) => {
        createPage({
          path: `case-studies/${node.slug}`,
          component: path.resolve(pathTemplateForPostType(node.internal.type)),
          context: {
            slug: node.slug,
          },
        });
      });

      const posts = combinePostTypes(
        result.data.allContentfulBlogPost,
        result.data.allContentfulLinkPost
      );

      posts.forEach((node, index) => {
        // these give an easy way to figure out which post is considered
        // the next newer/older post from within a blog post
        const newerPost = index > 0 ? posts[index - 1] : null;
        const olderPost = index < posts.length - 1 ? posts[index + 1] : null;

        createPage({
          path: `blog/${node.slug}`,
          component: path.resolve(pathTemplateForPostType(node.internal.type)),
          context: {
            slug: node.slug,
            newerPost: newerPost,
            olderPost: olderPost,
          },
        });
      });

      resolve();
    });
  });
};
