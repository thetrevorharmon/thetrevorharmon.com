import {graphql} from 'gatsby';
import * as React from 'react';

import {FeaturedPostItem, PostItem} from '../components';
import {Layout} from '../layouts';
import {BlogPost, LinkPost} from '../types';
import {Button, Header} from '../UI-Kit';
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
    limit: 4,
    linkPosts: props.data.allContentfulLinkPost.nodes,
  });

  const {tagline} = useSiteData();

  const titleMarkup = (
    <div className="space-y-little">
      <p>Hi there! 👋 I'm</p>
      <Header rank={1} type="Display">
        Trevor Harmon
      </Header>
      <p>{tagline}</p>
    </div>
  );

  return (
    <Layout>
      <div className="my-huge">{titleMarkup}</div>
      <div className="space-y-big">
        <FeaturedPostItem post={featuredPost} />
        {posts.map((post: BlogPost | LinkPost) => (
          <PostItem post={post} key={post.title} />
        ))}
      </div>
      <Button className="mt-big mb-large" url={Routes.blog()}>
        Read more posts &rarr;
      </Button>
    </Layout>
  );
};

export const query = graphql`
  query IndexPageQuery {
    allContentfulBlogPost(sort: {date: DESC}, limit: 5) {
      nodes {
        ...ContentfulBlogPost
      }
    }
    allContentfulLinkPost(sort: {date: DESC}, limit: 4) {
      nodes {
        ...ContentfulLinkPost
      }
    }
  }
`;
