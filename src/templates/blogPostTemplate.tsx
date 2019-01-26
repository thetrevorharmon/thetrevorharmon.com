import classnames from 'classnames';
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

type PostNavigationDirection = 'Older' | 'Newer';

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

  public makeNavigation = (title: string, slug: string, direction: PostNavigationDirection) => {
    const className = `post-link ${direction.toLowerCase()}-post`;

    return (
      <div className={classnames('col-lg-6', 'post-navigation')}>
        Read {direction}:<br/>
        <Link href={Routes.blogPost(slug)} className={className}>
          <span className="title">{title}</span>
        </Link>
      </div>
    );
  }

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
            <Header rank={1} type="Headline" className="mb-md-2">{blogPost.title}</Header>
            <p className="meta">{blogPost.date} • {blogPost.body.childMarkdownRemark.timeToRead} min read</p>
          </div>
        </div>
        <div className="post-body">

          <div className="row">
            <div className="col-lg-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: blogPost.body.childMarkdownRemark.html,
                }}
              />
            </div>
          </div>

          {
            blogPost.originallyPublishedAt
            ? (
              <div className="row">
                <div className="col-lg-8">
                  <i>
                    This article was originally published
                    on <Link href={blogPost.originallyPublishedAt}>Medium</Link>.
                  </i>
                </div>
              </div>
            ) : undefined
          }
        </div>

        <div className="row post-footer">
          {olderPost ? this.makeNavigation(olderPost.title, olderPost.slug, 'Older') : undefined}
          {newerPost ? this.makeNavigation(newerPost.title, newerPost.slug, 'Newer') : undefined}
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
          originallyPublishedAt
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
