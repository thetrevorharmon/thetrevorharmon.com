import { graphql } from 'gatsby';
import * as React from 'react';
import Layout from '../layouts';

import './blogPostTemplate.scss';
import './syntax-highlighting.scss';

import { Header, Image } from '../UI-Kit';

interface CaseStudyTemplateProps {
  data: {
    allContentfulBlogPost: {
      edges: [
        {
          node: BlogPost,
        },
      ],
    },
  };
}

export default class CaseStudyTemplate extends React.Component<CaseStudyTemplateProps, {}> {
  public render() {

    const blogPost = this.props.data.allContentfulBlogPost.edges[0].node;

    const pageMetadata: PageMetadata = {
      description: `${blogPost.description.description}`,
      title: `${blogPost.title}`,
    };

    return (
      <Layout className="blog-post-template" pageMetadata={pageMetadata}>
        <div className="row post-header my-5">
          <div className="col-lg-8">
            <Header rank={1} type="Headline" className="mb-md-4">{blogPost.title}</Header>
            <Header rank={2} type="Tagline">{blogPost.description.description}</Header>
            <p className="meta">{blogPost.publishDate} • {blogPost.body.childMarkdownRemark.timeToRead} min read</p>
          </div>
        </div>
        <div className="row post-body">
          <div className="col-lg-8">
            <div
              dangerouslySetInnerHTML={{
                __html: blogPost.body.childMarkdownRemark.html,
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
          publishDate(formatString: "MMMM DD, YYYY")
          body {
            childMarkdownRemark {
              html
              timeToRead
            }
          }
          tags
        }
      }
    }
  }
`;
