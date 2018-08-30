import { graphql } from "gatsby"
import * as React from "react"
import classnames from "classnames";

import Layout from "../layouts";

import * as styles from './homepage.module.scss';

import { Link, Button, Tile } from "../UI-Kit";

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

  public render() {
    return (
      <Layout>
        <div className="row">
          <p className="col">
            <h1 className={classnames(
              `my-8`,
              styles.MainHeader
            )}>
              <small>The</small><br/>
              Trevor<br/>
              Harmon
            </h1>
          </p>
        </div>
        <div className="row">
          {this.props.data.allContentfulCaseStudy.edges.map((data, index) => (
              <h2 key={index}>{data.node.title} <Link href={data.node.slug}>Check it out</Link></h2>
            )
          )}
        </div>
        <div className="row">
          {this.props.data.allContentfulProject.edges.map((data, index) => (
            <div className="col-sm-4">
              <Tile project={data.node} key={index} className='mb-4' />
            </div>
          ))}
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
