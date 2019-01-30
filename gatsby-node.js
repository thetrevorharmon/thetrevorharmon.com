/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require(`path`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allContentfulProject {
          edges {
            node {
              title
              slug
            }
          }
        }
        allContentfulCaseStudy {
          edges {
            node {
              title
              slug
            }
          }
        } 
        allContentfulBlogPost(sort: { order: DESC, fields: [date] })  {
          edges {
            node {
              title
              slug
            }
          }
        }   
      }
    `
  ).then(result => {
      result.data.allContentfulProject.edges.forEach(({ node }) => {
        createPage({
          path: `projects/${node.slug}`,
          component: path.resolve(`./src/templates/project/projectTemplate.tsx`),
          context: {
            slug: node.slug,
          },
        })
      })
      result.data.allContentfulCaseStudy.edges.forEach(({ node }) => {
        createPage({
          path: `case-studies/${node.slug}`,
          component: path.resolve(`./src/templates/post/caseStudy/caseStudyTemplate.tsx`),
          context: {
            slug: node.slug,
          },
        })
      })  
      result.data.allContentfulBlogPost.edges.forEach(({ node }, index) => {
        // these give an easy way to figure out which post is considered
        // the next newer/older post from within a blog post
        const newerPost = index > 0 
          ? result.data.allContentfulBlogPost.edges[index - 1].node 
          : null;

        const olderPost = index < result.data.allContentfulBlogPost.edges.length - 1 
          ? result.data.allContentfulBlogPost.edges[index + 1].node 
          : null;

        createPage({
          path: `blog/${node.slug}`,
          component: path.resolve(`./src/templates/post/blog/blogPostTemplate.tsx`),
          context: {
            slug: node.slug,
            newerPost: newerPost,
            olderPost: olderPost,
          },
        })
      })            
      resolve()
    })
  })
}
