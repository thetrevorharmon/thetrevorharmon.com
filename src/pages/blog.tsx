import classnames from 'classnames';
import { graphql } from 'gatsby';
import * as React from 'react';

import { Layout } from '../layouts';
import { Helpers, Routes } from '../utils';

import * as styles from './blog.module.scss';

import {
  Button,
  Header,
  Icon,
  Link,
  LinkHeader,
  Tile,
} from '../UI-Kit';

interface ProjectsPageProps {
  data: {
    allContentfulBlogPost: {
      edges: [
        {
          node: BlogPost,
        }
      ],
    },
    allContentfulLinkPost: {
      edges: [
        {
          node: LinkPost,
        }
      ],
    },
  };
}

export default class ProjectsPage extends React.Component<ProjectsPageProps, {}> {

  public render() {

    const pageMetadata: PageMetadata = {
      description: `My thoughts about code, design, and other musings.`,
      title: 'Blog',
      url: Routes.blog(),
    };

    const posts = Helpers.combinePostTypes(
      this.props.data.allContentfulBlogPost,
      this.props.data.allContentfulLinkPost,
    );

    return (
      <Layout pageMetadata={pageMetadata}>
        <div className="row">
          <div className="col">
            <Header
              rank={1}
              type="Headline"
              className={classnames(
                'mt-6 mt-lg-8',
              )}
            >
              {pageMetadata.title}
            </Header>
            <Header rank={3} type="Tagline" className="mb-6">
              {pageMetadata.description}
            </Header>
          </div>
        </div>

        {posts.map((post, index) => (
          <div className={classnames(styles.Post, 'mb-5')} key={index}>
            <div className="row">
              <div className="col-lg-8">
                <LinkHeader
                  hasLinkIcon={post.postType === 'Link'}
                  rank={2}
                  type="Title"
                  className="mb-md-4"
                  href={Routes.blogPost(post.slug)}
                >
                  {post.title}
                </LinkHeader>
                <Header rank={3} type="Tagline">{post.description || post.body.childMarkdownRemark.excerpt}</Header>
                <p className={styles.Meta}>
                  {post.date} • {post.body.childMarkdownRemark.timeToRead} min read
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8" key={index}>
                <Link href={Routes.blogPost(post.slug)}>Continue Reading &rarr;</Link>
              </div>
            </div>
          </div>
        ))}
      </Layout>
    );
  }
}

export const blogPageQuery = graphql`
  query blogPageQuery {
    allContentfulBlogPost(
      sort: { order: DESC, fields: [date] },
    ) {
      edges {
        node {
          title
          slug
          description
          date(formatString: "MMMM DD, YYYY")
          internal {
            type
          }
          body {
            childMarkdownRemark {
              html
              excerpt
              timeToRead
            }
          }
          tags
        }
      }
    }
    allContentfulLinkPost(
      sort: { order: DESC, fields: [date] },
    ) {
	  edges {
	    node {
	      title
        slug
        link
        date(formatString: "MMMM DD, YYYY")
        internal {
          type
        }
        body {
          childMarkdownRemark {
            html
            excerpt
            timeToRead
          }
        }
	    }
	  }
	}
}
`;
