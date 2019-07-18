import classnames from 'classnames';
import { graphql } from 'gatsby';
import * as React from 'react';

import { Layout } from '../layouts';

import * as styles from './blog.module.scss';

import '../templates/post/blog/blogPostTemplate.scss';

import {
  Button,
  Header,
  Link,
  Tile,
} from '../UI-Kit';

import { Routes } from '../utils';

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

    const posts: Post[] = [
      // blog posts
      ...this.props.data.allContentfulBlogPost.edges.map((edge) => edge.node),
      // link posts
      ...this.props.data.allContentfulLinkPost.edges.map((edge) => edge.node),
    ].sort(
      (firstDate: BlogPost | LinkPost, secondDate: BlogPost | LinkPost) => {
        const a = new Date(firstDate.date);
        const b = new Date(secondDate.date);

        if (a < b) { return 1; }
        if (a > b) { return -1; }

        return 0;
      },
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
                <Header rank={2} type="Title" className={classnames('mb-md-4', styles.Title)}>
                  <Link href={Routes.blogPost(post.slug)}>{post.title}</Link>
                </Header>

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
