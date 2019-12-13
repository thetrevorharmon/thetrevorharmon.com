import {graphql} from 'gatsby';

export const ContentfulAttribution = graphql`
  fragment ContentfulAttribution on ContentfulAttribution {
    name
    sourceLocation
    sourceName
    author
    type
    internal {
      type
    }
  }
`;
