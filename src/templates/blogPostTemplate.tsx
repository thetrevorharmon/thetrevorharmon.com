import { graphql } from 'gatsby';
import * as React from 'react';
import Layout from '../layouts';

import './caseStudyTemplate.scss';

import { Header, Image } from '../UI-Kit';

interface CaseStudyTemplateProps {
  // data: {
  //   allContentfulCaseStudy: {
  //     edges: [
  //       {
  //         node: CaseStudy,
  //       },
  //     ],
  //   },
  // };
}

export default class CaseStudyTemplate extends React.Component<CaseStudyTemplateProps, {}> {
  public render() {

    const caseStudy = this.props.data.allContentfulBlogPost.edges[0].node;

    const pageMetadata: PageMetadata = {
      // description: `${caseStudy.title} | ${caseStudy.tagline}`,
      title: `${caseStudy.title}`,
    };

    return (
      <Layout className="case-study-template" pageMetadata={pageMetadata}>
        <div className="row post-header my-5">
          <div className="col-lg-6">
            <Header rank={1} type="Headline" className="mb-0">{caseStudy.title}</Header>
            <Header rank={2} type="Tagline">{caseStudy.description.description}</Header>
          </div>
          <div className="col-lg-6">
            <Image src={caseStudy.featureImage} className="mt-4 mt-lg-0 hero-header" />
          </div>
        </div>
        <div className="row post-body">
          <div className="col-lg-8">
            <div
              dangerouslySetInnerHTML={{
                __html: caseStudy.body.childMarkdownRemark.html,
              }}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

export const query = graphql`
  query($slug: String!) {
    allContentfulBlogPost(filter: {slug: {eq: $slug}}) {
      edges {
        node {
          title
          slug
          description {
            description
          }
          publishDate
          body {
            childMarkdownRemark {
              html
            }            
            internal {
              mediaType
              content
            }
          }
          tags
        }
      }
    }
  }
`;
