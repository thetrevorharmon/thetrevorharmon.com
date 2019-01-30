import classnames from 'classnames';
import { graphql } from 'gatsby';
import * as React from 'react';

import Layout from '../layouts';

import * as styles from './blog.module.scss';

import '../templates/post/blog/blogPostTemplate.scss';

import {
  Button,
  Header,
  Link,
  Tile,
} from '../UI-Kit';

import { Routes } from '../utils';

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface ProjectsPageProps {
  data: {
    allContentfulBlogPost: {
      edges: [
        {
          node: BlogPost,
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

        {this.props.data.allContentfulBlogPost.edges.map((blogPost, index) => (
          <div className={classnames(styles.Post, 'mb-5')} key={index}>
            <div className="row">
              <div className="col-lg-8">
                <Header rank={2} type="Title" className={classnames('mb-md-4', styles.Title)}>
                  <Link href={Routes.blogPost(blogPost.node.slug)}>{blogPost.node.title}</Link>
                </Header>

                <Header rank={3} type="Tagline">{blogPost.node.description}</Header>
                <p className={styles.Meta}>
                  {blogPost.node.date} • {blogPost.node.body.childMarkdownRemark.timeToRead} min read
                </p>
              </div>
            </div>
            {/*
            <div className="row">
              <div className="col-lg-8">
                <p>{blogPost.node.body.childMarkdownRemark.excerpt}</p>
              </div>
            </div>
            */}

            <div className="row">
              <div className="col-lg-8" key={index}>
                <Link href={Routes.blogPost(blogPost.node.slug)}>Continue Reading &rarr;</Link>
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
  }
`;
