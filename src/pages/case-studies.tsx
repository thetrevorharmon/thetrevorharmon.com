import classnames from 'classnames';
import { graphql } from 'gatsby';
import * as React from 'react';

import Layout from '../layouts';

import {
  Button,
  CaseStudyTile,
  Header,
  Link,
  Tile,
} from '../UI-Kit';

import { Routes } from '../utils';

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface CaseStudyPageProps {
  data: {
    allContentfulCaseStudy: {
      edges: [
        {
           node: CaseStudy,
        },
      ],
    },
  };
}

export default class CaseStudiesPage extends React.Component<CaseStudyPageProps, {}> {

  public render() {

    const pageMetadata: PageMetadata = {
      description: `These case studies are an in-depth look at some of the more interesting design
      and development work I've done. I try to detail my process and the results of the work I did.`,
      pageTitle: 'Case Studies',
      pageUrl: Routes.caseStudies(),
    };

    return (
      <Layout pageMetadata={pageMetadata}>
        <div className="row">
          <div className="col">
            <Header
              rank={1}
              type="Headline"
              className={classnames(
                'my-6 my-lg-8',
              )}
            >
              Case Studies
            </Header>
          </div>
        </div>
        <div className="row">
          {this.props.data.allContentfulCaseStudy.edges.map((item, index) => (
              <div className="col-sm-12 col-md-12 col-lg-8 mb-4" key={index}>
                <CaseStudyTile item={item.node} className="mb-4" />
              </div>
            ),
          )}
        </div>
      </Layout>
    );
  }
}

export const caseStudiesPageQuery = graphql`
  query caseStudiesPageQuery {
    allContentfulCaseStudy {
      edges {
        node {
          ...ContentfulCaseStudyTile
        }
      }
    }
  }
`;
