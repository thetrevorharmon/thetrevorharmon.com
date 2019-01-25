import { graphql } from 'gatsby';
import * as React from 'react';
import Layout from '../layouts';

import './blogPostTemplate.scss';
import './syntax-highlighting.scss';

import {
  Header,
  Image,
  Link,
} from '../UI-Kit';

import { Routes } from '../utils';

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
  pageContext: {
    slug: string,
    newerPost?: {
      title: string,
      slug: string,
    },
    olderPost?: {
      title: string,
      slug: string,
    },
  };
}

export default class CaseStudyTemplate extends React.Component<CaseStudyTemplateProps, {}> {
  public render() {

    const blogPost = this.props.data.allContentfulBlogPost.edges[0].node;

    const {
      newerPost,
      olderPost,
    } = this.props.pageContext;

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
            <p className="meta">{blogPost.date} • {blogPost.body.childMarkdownRemark.timeToRead} min read</p>
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
        <div className="row post-footer">
          <div className="col-lg-6">
            {
              olderPost
              ? (
                <Link href={Routes.blogPost(olderPost.slug)}>
                  <span>{olderPost.title}</span>
                  <br/>
                  &larr; Read Older
                </Link>
              ) : undefined
            }
          </div>
          <div className="col-lg-6">
            {
              newerPost
              ? (
                  <Link href={Routes.blogPost(newerPost.slug)}>
                    <span>{newerPost.title}</span>
                    <br/>
                    Read Newer &rarr;
                  </Link>
              ) : undefined
            }
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
          date(formatString: "MMMM DD, YYYY")
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
