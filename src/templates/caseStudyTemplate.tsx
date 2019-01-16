import { graphql } from 'gatsby';
import * as React from 'react';
import Layout from '../layouts';

import './caseStudyTemplate.scss';

import { Header, Image } from '../UI-Kit';

interface CaseStudyTemplateProps {
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

export default class CaseStudyTemplate extends React.Component<CaseStudyTemplateProps, {}> {
  public render() {

    const caseStudy = this.props.data.allContentfulCaseStudy.edges[0].node;

    const pageMetadata: PageMetadata = {
      description: `${caseStudy.title} | ${caseStudy.tagline}`,
      title: `${caseStudy.title} Case Study`,
    };

    return (
      <Layout className="case-study-template" pageMetadata={pageMetadata}>
        <div className="row post-header my-5">
          <div className="col-lg-6">
            <Header rank={1} type="Headline" className="mb-0">{caseStudy.title}</Header>
            <Header rank={2} type="Tagline">{caseStudy.tagline}</Header>
          </div>
          <div className="col-lg-6">
            <Image src={caseStudy.featureImage} className="mt-4 mt-lg-0 hero-header" />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8">
            <div className="table-of-contents mt-5 mb-7 pl-md-6">
              <Header rank={3} type="SectionTitle">Table of Contents</Header>
              <div
                dangerouslySetInnerHTML={{
                  __html: caseStudy.tableOfContents.childMarkdownRemark.html,
                }}
              />
            </div>
          </div>
        </div>
        <div className="row post-body">
          <div
            className="col-lg-8"
            dangerouslySetInnerHTML={{
                __html: caseStudy.post.childMarkdownRemark.html,
            }}
          />
        </div>
      </Layout>
    );
  }
}

export const query = graphql`
  query($slug: String!) {
    allContentfulCaseStudy(filter: {slug: {eq: $slug}}) {
      edges {
        node {
          id
          title
          slug
          tagline
          featureImage {
            ...ContentfulAsset_width750
          }
          post {
            childMarkdownRemark {
              html
            }
            internal {
              mediaType
              content
            }
          }
          tableOfContents {
            childMarkdownRemark {
              html
            }
            internal {
              mediaType
              content
            }
          }
        }
      }
    }
  }
`;
