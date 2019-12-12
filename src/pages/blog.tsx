import classnames from 'classnames';
import {graphql} from 'gatsby';
import * as React from 'react';

import {Layout} from '../layouts';
import {BlogPost, LinkPost} from '../types';
import {
  FeaturedPostItem,
  Header,
  PostItem,
  Space,
  Spacer,
  TextStyle,
} from '../UI-Kit';
import {Helpers, Routes} from '../utils';

interface ProjectsPageProps {
  data: {
    allContentfulBlogPost: allContentfulNodes<BlogPost>;
    allContentfulLinkPost: allContentfulNodes<LinkPost>;
  };
}

export default (props: ProjectsPageProps) => {
  const pageMetadata: PageMetadata = {
    description: `A collection of my thoughts, typically related to code or design.`,
    title: 'Blog',
    url: Routes.blog(),
  };

  const [featuredPost, posts] = Helpers.combinePostTypes({
    blogPosts: props.data.allContentfulBlogPost.nodes,
    linkPosts: props.data.allContentfulLinkPost.nodes,
  });

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
          <FeaturedPostItem post={featuredPost} />
          {posts.map((post) => (
            <PostItem post={post} key={post.title} />
          ))}
        </Spacer>
      </Spacer>
    </Layout>
  );
};

export const query = graphql`
  query blogPageQuery {
    allContentfulBlogPost(sort: {order: DESC, fields: [date]}) {
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
    allContentfulLinkPost(sort: {order: DESC, fields: [date]}) {
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
            excerpt
            timeToRead
          }
        }
      }
    }
  }
`;
