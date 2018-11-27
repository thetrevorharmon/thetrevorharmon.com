import classnames from 'classnames';
import { graphql } from 'gatsby';
import * as React from 'react';

import Layout from '../layouts';

import * as styles from './homepage.module.scss';

import {
  Button,
  Header,
  Link,
  Tile,
} from '../UI-Kit';

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        siteName: string,
      },
    },
    allContentfulProject: {
      edges: [
        {
          node: Project,
        }
      ],
    },
    allContentfulCaseStudy: {
      edges: [
        {
           node: CaseStudy,
        }
      ],
    },
  };
}

export default class IndexPage extends React.Component<IndexPageProps, {}> {

  public render() {

    const featureItems: Array<({node: Project} | {node: CaseStudy})> = [
      ...this.props.data.allContentfulCaseStudy.edges,
      ...this.props.data.allContentfulProject.edges,
    ];

    return (
      <Layout>
        <div className="row">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <div className={classnames(
                styles.MainHeader,
                'my-6 mt-lg-8 mb-lg-8'
              )}>
              <span>Hi, I'm</span>
              <Header
                rank={1}
                type="Headline"
                className={classnames(
                  styles.Name,
                  "my-0"
                )}
              >
                Trevor Harmon.
              </Header>
              <p className="mt-5">
                I’ve been doing design &amp; development work for about ten years.
                I love building beautiful, usable things.
              </p>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <Header rank={2} type="Subtitle" className="col">Featured</Header>
        </div>
        <div className="row">
          {featureItems.map((item, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <Tile item={item.node} className="mb-4" />
            </div>
          ))}
        </div>
      </Layout>
    );
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
