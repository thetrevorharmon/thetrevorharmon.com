import classnames from 'classnames';
import { graphql } from 'gatsby';
import * as React from 'react';

import Layout from '../layouts';

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
        <div className="row">
          {this.props.data.allContentfulBlogPost.edges.map((item, index) => (
            <div className="col-sm-12" key={index}>
              <h2>
                <Link href={`/blog/${item.node.slug}`}>
                  {item.node.title}
                </Link>
              </h2>
            </div>
          ))}
        </div>
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
          publishDate
          body {
            childMarkdownRemark {
              html
            }
          }
          tags
        }
      }
    }
  }
`;
