import {graphql} from 'gatsby';
import * as React from 'react';
import {Layout} from '../../../layouts';

import {useTheme} from '../../../context/ThemeContext';
import {Header, Image} from '../../../UI-Kit';
import {Routes} from '../../../utils';
import './caseStudyTemplate.scss';

interface CaseStudyTemplateProps {
  data: {
    allContentfulCaseStudy: {
      edges: [
        {
          node: CaseStudy;
        },
      ];
    };
  };
  pageContext: {
    slug: string;
  };
}

export default (props: CaseStudyTemplateProps) => {
  const caseStudy = props.data.allContentfulCaseStudy.edges[0].node;

  const pageMetadata: PageMetadata = {
    description: `${caseStudy.tagline}`,
    image: caseStudy.featureImage.fluid.src,
    title: `${caseStudy.title} Case Study`,
    url: Routes.caseStudy(props.pageContext.slug),
  };

  const theme = useTheme();

  return (
    <Layout
      className={`case-study-template ${theme}`}
      pageMetadata={pageMetadata}
    >
      <div className="post-header">
        <Header rank={1} type="Title">
          {caseStudy.title}
        </Header>
        <Header rank={2} type="Heading">
          {caseStudy.tagline}
        </Header>
        <Image src={caseStudy.featureImage} className="hero-header" />
      </div>

      <div className="table-of-contents">
        <Header rank={3} type="Heading">
          Table of Contents
        </Header>
        <div
          dangerouslySetInnerHTML={{
            __html: caseStudy.tableOfContents.childMarkdownRemark.html,
          }}
        />
      </div>

      <div className="post-body">
        <div
          dangerouslySetInnerHTML={{
            __html: caseStudy.post.childMarkdownRemark.html,
          }}
        />
      </div>
    </Layout>
  );
};

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
