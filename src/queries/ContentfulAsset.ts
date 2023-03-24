import {graphql} from 'gatsby';

export const ContentfulAsset = graphql`
  fragment ContentfulAsset on ContentfulAsset {
    title
    description
    gatsbyImageData(layout: FULL_WIDTH)
    internal {
      type
    }
  }
`;
