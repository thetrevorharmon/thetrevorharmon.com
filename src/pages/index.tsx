import {graphql} from 'gatsby';
import * as React from 'react';

import {Layout} from '../layouts';
import {BlogItem, Button, Header, Space, Spacer} from '../UI-Kit';
import {Helpers, Routes} from '../utils';
import {useSiteData} from '../utils/hooks';
import * as styles from './homepage.module.scss';

interface IndexPageProps {
  data: {
    site: {
      siteMetadata: SiteMetadata;
    };
    allContentfulProject: {edges: [{node: Project}]};
    allContentfulBlogPost: {edges: [{node: BlogPost}]};
    allContentfulLinkPost: {edges: [{node: LinkPost}]};
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
        {/* TODO: fix this once spacer is better */}
        <Spacer size="large">
          {posts.map((post: BlogPost | LinkPost) => (
            <BlogItem post={post} key={post.title} />
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
    site {
      siteMetadata {
        tagline
      }
    }
    allContentfulProject(
      filter: {featureOnHomepage: {eq: true}}
      sort: {fields: [projectCompletionDate], order: DESC}
    ) {
      edges {
        node {
          ...ContentfulProjectTile
        }
      }
    }
    allContentfulBlogPost(sort: {order: DESC, fields: [date]}, limit: 3) {
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
    allContentfulLinkPost(sort: {order: DESC, fields: [date]}, limit: 3) {
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
              excerpt(format: PLAIN, pruneLength: 116)
              timeToRead
            }
          }
        }
      }
    }
  }
`;
