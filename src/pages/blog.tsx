import classnames from 'classnames';
import { graphql } from 'gatsby';
import * as React from 'react';

import Layout from '../layouts';

import * as styles from './blog.module.scss';

import '../templates/blogPostTemplate.scss';

import {
  Button,
  Header,
  Link,
  Tile,
} from '../UI-Kit';

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
      description: `These are the writings of my blog.`,
      title: 'Blog',
    };

    return (
      <Layout pageMetadata={pageMetadata}>
        <div className="row">
          <div className="col">
            <Header
              rank={1}
              type="Headline"
              className={classnames(
                'my-6 my-lg-8',
              )}
            >
              Blog
            </Header>
          </div>
        </div>

        {this.props.data.allContentfulBlogPost.edges.map((blogPost, index) => (
          <div className={classnames(styles.Post, 'mb-5')} key={index}>
            <div className="row">
              <div className="col-lg-8">
                <Header rank={2} type="Title" className={classnames('mb-md-4', styles.Title)}>
                  {blogPost.node.title}
                </Header>

                <Header rank={3} type="Tagline">{blogPost.node.description.description}</Header>
                <p className={styles.Meta}>
                  {blogPost.node.publishDate} • {blogPost.node.body.childMarkdownRemark.timeToRead} min read
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-8">
                <p>{blogPost.node.body.childMarkdownRemark.excerpt}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-8" key={index}>
                <Link href={`/blog/${blogPost.node.slug}`}>Continue Reading &rarr;</Link>
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
    allContentfulBlogPost(sort: {fields: [publishDate], order: DESC}) {
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
