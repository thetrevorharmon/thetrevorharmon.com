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
        allContentfulBlogPost {
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
          component: path.resolve(`./src/templates/projectTemplate.tsx`),
          context: {
            slug: node.slug,
          },
        })
      })
      result.data.allContentfulCaseStudy.edges.forEach(({ node }) => {
        createPage({
          path: node.slug,
          component: path.resolve(`./src/templates/caseStudyTemplate.tsx`),
          context: {
            slug: node.slug,
          },
        })
      })  
      result.data.allContentfulBlogPost.edges.forEach(({ node }) => {
        createPage({
          path: `blog/${node.slug}`,
          component: path.resolve(`./src/templates/blogPostTemplate.tsx`),
          context: {
            slug: node.slug,
          },
        })
      })            
      resolve()
    })
  })
}
