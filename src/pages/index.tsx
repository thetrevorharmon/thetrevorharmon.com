import { graphql } from "gatsby"
import * as React from "react"
import Layout from "../layouts";

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        siteName: string
      }
    }
    allContentfulProject: {
      edges: [
        {
          node: Project
        }
      ]
    }
  }
}

export const pageQuery = graphql`
  query PageQuery {
    site {
      siteMetadata {
        siteName
      }
    }    
    allContentfulProject {
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

export default class IndexPage extends React.Component<IndexPageProps, {}> {
  readonly hello = `Hello`

  public render() {
    console.log(this.props.data)
    const { siteName } = this.props.data.site.siteMetadata
    return (
      <Layout>
        <h1>{this.hello} Typescript world!</h1>
        <p>
          This site is named <strong>{siteName}</strong>
        </p>
      </Layout>
    )
  }
}
