import { graphql } from "gatsby"
import * as React from "react"
import classnames from "classnames";

import Layout from "../layouts";

import * as styles from './homepage.module.scss';

import { Link, Button, Tile, Header } from "../UI-Kit";

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

    const featureItems: [PortfolioItem] = [
      ...this.props.data.allContentfulCaseStudy.edges,
      ...this.props.data.allContentfulProject.edges
    ];

    return (
      <Layout>
        <div className="row">
          <div className="col">
            <Header
              rank={1}
              type="Headline"
              className={classnames(
                "my-6 mt-lg-6 mb-lg-8",
                styles.MainHeader
              )}
            >
              <span>The</span><br/>
              Trevor<br/>
              Harmon
            </Header>
          </div>
        </div>
        <div className="row mb-3">
          <Header rank={2} type="Subtitle" className="col">Featured</Header>
        </div>
        <div className="row">
          {featureItems.map((item, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <Tile item={item.node} className='mb-4' />
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
    allContentfulProject(filter: {featureOnHomepage: {eq: true}}) {
      edges {
        node {
          title
          slug
          featureOnHomepage
          featureImage {
            id
            resolutions {
              src
            }
          }          
        }
      }
    }
    allContentfulCaseStudy(filter: {featureOnHomepage: {eq: true}}) {
      edges {
        node {
          title
          slug
          featureOnHomepage
          featureImage {
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
