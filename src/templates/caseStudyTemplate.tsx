import { graphql } from "gatsby"
import * as React from "react"
import Layout from "../layouts"
import Link from "gatsby-link"

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
    return (
      <Layout>
        <Link to="/">Go Back</Link>
        <h1>{caseStudy.title}</h1>
        <div dangerouslySetInnerHTML={{
          __html: caseStudy.post.childMarkdownRemark.html
        }} />
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
          heroImage {
            resolutions {
              src
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
        }
      }
    }        
  }
`
