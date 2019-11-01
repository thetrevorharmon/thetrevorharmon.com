import {graphql} from 'gatsby';
import * as React from 'react';

import {PostTemplate} from './PostTemplate';

interface LinkPostTemplateProps {
  data: {
    allContentfulLinkPost: {
      edges: [
        {
          node: LinkPost;
        }
      ];
    };
    site: {
      siteMetadata: SiteMetadata;
    };
  };
  pageContext: {
    slug: string;
    newerPost?: BasicPost;
    olderPost?: BasicPost;
  };
}

export default (props: LinkPostTemplateProps) => {
  const siteMetadata = props.data.site.siteMetadata;
  const linkPost: LinkPost = {
    ...props.data.allContentfulLinkPost.edges[0].node,
    postType: 'Link',
  };

  const {newerPost, olderPost} = props.pageContext;

  return (
    <PostTemplate
      post={linkPost}
      newerPost={newerPost}
      olderPost={olderPost}
      siteMetadata={siteMetadata}
    />
  );
};

export const query = graphql`
  query($slug: String!) {
    allContentfulLinkPost(filter: {slug: {eq: $slug}}) {
      edges {
        node {
          title
          slug
          link
          date(formatString: "MMMM DD, YYYY")
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
