import {graphql} from 'gatsby';
import * as React from 'react';

import {Layout} from '../layouts';
import {BlogPost, isLinkPost, LinkPost} from '../types/Post';
import {BlogItem, Button, Header, Meta, Space, Spacer} from '../UI-Kit';
import {Helpers, Routes, useSiteData} from '../utils';

interface IndexPageProps {
  data: {
    allContentfulBlogPost: allContentfulEdgesWithNode<BlogPost>;
    allContentfulLinkPost: allContentfulEdgesWithNode<LinkPost>;
  };
}

export default (props: IndexPageProps) => {
  const posts = Helpers.combinePostTypes(
    props.data.allContentfulBlogPost,
    props.data.allContentfulLinkPost,
  ).slice(0, 4);

  const {tagline} = useSiteData();

  const titleMarkup = (
    <Spacer size="little">
      <Space size="huge" />
      {/* TODO: Make sure emojis are supported */}
      <p>Hi there! 👋 I'm</p>
      <Header rank={1} type="Display">
        Trevor Harmon
      </Header>
      <p>{tagline}</p>
      <Space size="huge" />
    </Spacer>
  );

  return (
    <Layout>
      {titleMarkup}
      <Spacer>
        <Spacer size="large">
          {posts.map((post: BlogPost | LinkPost) => (
            <BlogItem
              title={post.title}
              meta={
                <Meta
                  date={post.date}
                  timeToRead={
                    post.internal && post.body.childMarkdownRemark.timeToRead
                  }
                  isLinkPost={isLinkPost(post)}
                />
              }
              linkHref={Routes.blogPost(post.slug)}
              description={
                post.description || post.body.childMarkdownRemark.excerpt || ''
              }
              key={post.title}
            />
          ))}
        </Spacer>
        <Space size="big" />
        <Button href={Routes.blog()}>Read more posts &rarr;</Button>
      </Spacer>
    </Layout>
  );
};

export const query = graphql`
  query indexPageQuery {
    allContentfulBlogPost(sort: {order: DESC, fields: [date]}, limit: 3) {
      edges {
        node {
          title
          slug
          description
          date(formatString: "DD MMM YYYY")
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
    allContentfulLinkPost(sort: {order: DESC, fields: [date]}, limit: 3) {
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
              excerpt(format: PLAIN, pruneLength: 116)
              timeToRead
            }
          }
          internal {
            type
          }
        }
      }
    }
  }
`;
