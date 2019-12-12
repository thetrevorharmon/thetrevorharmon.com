import classnames from 'classnames';
import {graphql} from 'gatsby';
import * as React from 'react';

import {Layout} from '../layouts';
import {BlogPost, isBlogPost, isLinkPost, LinkPost} from '../types/Post';
import {
  BlogItem,
  FeaturedItem,
  Header,
  Meta,
  Space,
  Spacer,
  TextStyle,
} from '../UI-Kit';
import {Helpers, Routes} from '../utils';

interface ProjectsPageProps {
  data: {
    allContentfulBlogPost: allContentfulEdgesWithNode<BlogPost>;
    allContentfulLinkPost: allContentfulEdgesWithNode<LinkPost>;
  };
}

export default (props: ProjectsPageProps) => {
  const pageMetadata: PageMetadata = {
    description: `A collection of my thoughts, typically related to code or design.`,
    title: 'Blog',
    url: Routes.blog(),
  };

  const posts = Helpers.combinePostTypes(
    props.data.allContentfulBlogPost,
    props.data.allContentfulLinkPost,
  );

  return (
    <Layout pageMetadata={pageMetadata}>
      <Spacer>
        <Space size="huge" />
        <Header rank={1} type="Display">
          {pageMetadata.title}
        </Header>
        <Space size="small" />
        <p>
          <TextStyle style="Body">{pageMetadata.description}</TextStyle>
        </p>
        <Space size="huge" />

        <Spacer size="large">
          {posts.map((post, index) => (
            <>
              {index === 1 && isBlogPost(post) && post.heroImage != null ? (
                // TODO: this kinda sucks. I think that having "blog" specific wrappers might be nice.
                <FeaturedItem
                  image={post.heroImage}
                  title={post.title}
                  meta={
                    <Meta
                      date={post.date}
                      timeToRead={
                        post.internal &&
                        post.body.childMarkdownRemark.timeToRead
                      }
                    />
                  }
                  linkHref={Routes.blogPost(post.slug)}
                  description={
                    post.description ||
                    post.body.childMarkdownRemark.excerpt ||
                    ''
                  }
                  key={index}
                />
              ) : (
                <BlogItem
                  title={post.title}
                  meta={
                    <Meta
                      date={post.date}
                      timeToRead={
                        post.internal &&
                        post.body.childMarkdownRemark.timeToRead
                      }
                      isLinkPost={isLinkPost(post)}
                    />
                  }
                  linkHref={Routes.blogPost(post.slug)}
                  description={
                    post.description ||
                    post.body.childMarkdownRemark.excerpt ||
                    ''
                  }
                  key={index}
                />
              )}
            </>
          ))}
        </Spacer>
      </Spacer>
    </Layout>
  );
};

// TODO: figure out featured post
export const query = graphql`
  query blogPageQuery {
    allContentfulBlogPost(sort: {order: DESC, fields: [date]}) {
      edges {
        node {
          title
          slug
          description
          date(formatString: "DD MMM YYYY")
          heroImage {
            ...ContentfulAsset_width750
          }
          body {
            childMarkdownRemark {
              html
              excerpt
              timeToRead
            }
          }
          tags
          internal {
            type
          }
        }
      }
    }
    allContentfulLinkPost(sort: {order: DESC, fields: [date]}) {
      edges {
        node {
          title
          slug
          link
          date(formatString: "DD MMM YYYY")
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
