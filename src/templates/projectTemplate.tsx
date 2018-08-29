import { graphql } from "gatsby"
import * as React from "react"

import Layout from "../layouts"
import { Button } from "../UI-Kit";

interface TemplateProps {
  data: {
    allContentfulProject: {
      edges: [
        {
          node: Project
        }
      ]
    }
  }
}

export default class Template extends React.Component<TemplateProps, {}> {
  render() {
    const project = this.props.data.allContentfulProject.edges[0].node

    return (
      <Layout>
        <Button href="/">Go Back</Button>
        <h1>{project.title}</h1>
        <p>{project.description ? project.description.description : ''}</p>
      </Layout>
    )  
  }
}

export const query = graphql`
  query($slug: String!) {
    allContentfulProject(filter: {slug: {eq: $slug}}) {
      edges {
        node {
          title
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
