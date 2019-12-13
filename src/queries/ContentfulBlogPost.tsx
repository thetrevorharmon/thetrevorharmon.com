import {graphql} from 'gatsby';
import * as React from 'react';

export const ContentfulBlogPost = graphql`
  fragment ContentfulBlogPost on ContentfulBlogPost {
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
`;
