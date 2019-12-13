import {graphql} from 'gatsby';

export const ContentfulAsset = graphql`
  fragment ContentfulAsset on ContentfulAsset {
    title
    description
    fluid(maxWidth: 750) {
      ...GatsbyContentfulFluid_withWebp
    }
    internal {
      type
    }
  }
`;
