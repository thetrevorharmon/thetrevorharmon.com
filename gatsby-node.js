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
              client
              description {
                description
                id
              }
              photos {
                id
                resolutions {
                  src
                }
              }
            }
          }
        }
      }
    `
  ).then(result => {
      result.data.allContentfulProject.edges.forEach(({ node }) => {
        createPage({
          path: node.slug,
          component: path.resolve(`./src/templates/project.tsx`),
          context: {
            slug: node.slug,
          },
        })
      })
      resolve()
    })
  })
}
