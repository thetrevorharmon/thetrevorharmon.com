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

    // const projects: [Project] = [];

    // this.props.data.allContentfulProject.edges.map((item) => {
    //   let project: Project = item;
    //   projects.push(project);
    // })

    // projects.map((item) => {
    //   console.log(item instanceof Project)
    // })

    // const projectsAndStudies: [Project | CaseStudy] = [...this.props.data.allContentfulProject.edges, ...this.props.data.allContentfulCaseStudy.edges]
    
    // projectsAndStudies.map((item) => {
    //   console.log(item.type)
    // })

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
        <div className="row">
          <Header rank={2} type="Subtitle" className="col">Featured</Header>
        </div>
        {/*
          <div className="row">
            {this.props.data.allContentfulCaseStudy.edges.map((data, index) => (
                <h2 key={index} className="col">{data.node.title} <Link href={data.node.slug}>Check it out</Link></h2>
              )
            )}
          </div>
        */}
        <div className="row">
          {this.props.data.allContentfulProject.edges.map((data, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <Tile project={data.node} className='mb-4' />
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
          projectImages {
            id
            resolutions {
              src
            }
          }
          featureImage {
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
