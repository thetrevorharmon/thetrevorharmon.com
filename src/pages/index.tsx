import {graphql} from 'gatsby';
import * as React from 'react';

import {Layout} from '../layouts';
import {BlogPost, LinkPost} from '../types';
import {
  Button,
  FeaturedPostItem,
  Header,
  PostItem,
  Space,
  Spacer,
} from '../UI-Kit';
import {Helpers, Routes, useSiteData} from '../utils';

interface IndexPageProps {
  data: {
    allContentfulBlogPost: allContentfulNodes<BlogPost>;
    allContentfulLinkPost: allContentfulNodes<LinkPost>;
  };
}

export default (props: IndexPageProps) => {
  const [featuredPost, posts] = Helpers.combinePostTypes({
    blogPosts: props.data.allContentfulBlogPost.nodes,
    linkPosts: props.data.allContentfulLinkPost.nodes,
    limit: 4,
  });

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
          <FeaturedPostItem post={featuredPost} />
          {posts.map((post: BlogPost | LinkPost) => (
            <PostItem post={post} key={post.title} />
          ))}
        </Spacer>
        <Space size="big" />
        <Button url={Routes.blog()}>Read more posts &rarr;</Button>
      </Spacer>
    </Layout>
  );
};

export const query = graphql`
  query indexPageQuery {
    allContentfulBlogPost(sort: {order: DESC, fields: [date]}, limit: 5) {
      nodes {
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
    allContentfulLinkPost(sort: {order: DESC, fields: [date]}, limit: 4) {
      nodes {
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
`;
