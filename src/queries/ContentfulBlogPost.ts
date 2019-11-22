import {graphql} from 'gatsby';

export const ContentfulBlogPost = graphql`
  fragment ContentfulBlogPost on ContentfulBlogPost {
    title
    slug
    description
    date(formatString: "DD MMM YYYY")
    heroImage {
      ...ContentfulAsset
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
