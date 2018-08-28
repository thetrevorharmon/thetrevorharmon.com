import { graphql } from "gatsby"
import * as React from "react"
import Layout from "../layouts";

import { Tile } from "../components";

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface ProjectPageProps {
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

export const projectPageQuery = graphql`
  query ProjectPageQuery { 
    allContentfulProject(filter: {slug: {eq: "i-am-a-tourist-tee"}}) {
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
`;

export default class ProjectPage extends React.Component<ProjectPageProps, {}> {
  public render() {

    return (
      <Layout>
        <h1>This is the project page</h1>
        <div>
          {this.props.data.allContentfulProject.edges.map((data, index) => (<Tile project={data.node} key={index} />))}
        </div>
      </Layout>
    )
  }
}
