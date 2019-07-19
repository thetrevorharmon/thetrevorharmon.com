import { graphql } from 'gatsby';
import * as React from 'react';

import { PostTemplate } from './PostTemplate';

interface BlogPostTemplateProps {
  data: {
    allContentfulBlogPost: {
      edges: [
        {
          node: BlogPost,
        },
      ],
    },
    site: {
      siteMetadata: SiteMetadata,
    },
  };
  pageContext: {
    slug: string,
    newerPost?: BasicPost,
    olderPost?: BasicPost,
  };
}

export default (props: BlogPostTemplateProps) => {

  const siteMetadata = props.data.site.siteMetadata;
  const blogPost: BlogPost = {
    ...props.data.allContentfulBlogPost.edges[0].node,
    postType: 'Blog',
  };

  const {
    newerPost,
    olderPost,
  } = props.pageContext;

  return (
    <PostTemplate
      post={blogPost}
      newerPost={newerPost}
      olderPost={olderPost}
      siteMetadata={siteMetadata}
    />
  );
};

export const query = graphql`
  query($slug: String!) {
    allContentfulBlogPost(filter: {slug: {eq: $slug}}) {
      edges {
        node {
          heroImage {
            ...ContentfulAsset_width750
          }
          title
          slug
          subtitle
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
          sourceAttribution {
            ...ContentfulAttribution
          }
          photoAttribution {
            ...ContentfulAttribution
          }
        }
      }
    }
    site {
      siteMetadata {
        siteUrl
        feedUrl
        twitter {
          author
        }
      }
    }
  }
`;
