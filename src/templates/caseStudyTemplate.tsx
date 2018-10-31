import { graphql } from "gatsby"
import * as React from "react"
import Layout from "../layouts"

import './caseStudy.scss';

import { Header } from '../UI-Kit';
import { largestPhotoFromSet } from "../utils";

interface CaseStudyTemplateProps {
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

export default class CaseStudyTemplate extends React.Component<CaseStudyTemplateProps, {}> {
  render() {

    const caseStudy = this.props.data.allContentfulCaseStudy.edges[0].node

    const heroStyle = {
      backgroundImage: `url(${largestPhotoFromSet(caseStudy.featureImage)})`
    }

    return (
      <Layout className="case-study-template" >
        <div className="row post-header">
          <div className="col-lg-6">
            <Header rank={1} type="Headline">{caseStudy.title}</Header>

            <div className="table-of-contents">
              <Header rank={2} type="Subtitle">Table of Contents</Header>
              <div dangerouslySetInnerHTML={{
                __html: caseStudy.tableOfContents.childMarkdownRemark.html
              }} />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-header mt-2" style={heroStyle} />
          </div>
        </div>
        <div className="row post-body">
          <div className="col-lg-8 offset-lg-2">
            <div dangerouslySetInnerHTML={{
              __html: caseStudy.post.childMarkdownRemark.html
            }} />
          </div>
        </div>
      </Layout>
    )  
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
          featureImage {
            resolutions {
              srcSet
            }
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
`
