import { graphql } from "gatsby"
import * as React from "react"
// import Link from "gatsby-link"

import Layout from "../layouts";
import { Tile } from "../components";

import { Link, Button } from "../UI-Kit";

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
    allContentfulCaseStudy: {
      edges: [
        {
           node: CaseStudy 
        }
      ]
    }
  }
}

export default class IndexPage extends React.Component<IndexPageProps, {}> {
  readonly hello = `Hello`

  public render() {
    const { siteName } = this.props.data.site.siteMetadata
    return (
      <Layout>
        <h1>{this.hello} Typescript world!</h1>
        <p>
          This site is named <strong>{siteName}</strong>
          <Link href="http://google.com">Take me to Google</Link>
          <Button href="i-am-a-tourist-tee">Show me a tourist tee</Button>
        </p>
        <div>
          {this.props.data.allContentfulCaseStudy.edges.map((data, index) => (
              <h2 key={index}>{data.node.title} <Link href={data.node.slug}>Check it out</Link></h2>
            )
          )}
        </div>
        <div>
          {this.props.data.allContentfulProject.edges.map((data, index) => (<Tile project={data.node} key={index} />))}
        </div>
      </Layout>
    )
  }
}

export const indexPageQuery = graphql`
  query indexPageQuery {
    site {
      siteMetadata {
        siteName
      }
    }    
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
    allContentfulCaseStudy {
      edges {
        node {
          title
          slug
        }
      }
    }    
  }
`;
