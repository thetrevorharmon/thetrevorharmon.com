import { graphql } from "gatsby"
import * as React from "react"
import classnames from "classnames";

import Layout from "../layouts";

// import * as styles from './caseStudies.module.scss';

import { Link, Button, Tile, Header } from "../UI-Kit";

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface CaseStudyPageProps {
  data: {
    allContentfulCaseStudy: {
      edges: [
        {
           node: CaseStudy 
        }
      ]
    }
  }
}

export default class CaseStudiesPage extends React.Component<CaseStudyPageProps, {}> {

  public render() {
    return (
      <Layout>
        <div className="row">
          <div className="col">
            <Header
              rank={1}
              type="Headline"
              className={classnames(
                "my-6 my-lg-8"
              )}
            >
              Case Studies
            </Header>
          </div>
        </div>
        <div className="row">
          <Header rank={2} type="Subtitle" className="col">Featured</Header>
        </div>
        <div className="row">
          {this.props.data.allContentfulCaseStudy.edges.map((data, index) => (
              <h2 key={index} className="col">{data.node.title} <Link href={data.node.slug}>Check it out</Link></h2>
            )
          )}
        </div>
      </Layout>
    )
  }
}

export const caseStudiesPageQuery = graphql`
  query caseStudiesPageQuery {
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
