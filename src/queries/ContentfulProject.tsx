import { graphql } from 'gatsby';
import * as React from 'react';

export const ContentfulProjectTile = graphql`
  fragment ContentfulProjectTile on ContentfulProject {
    title
    slug
    featureOnHomepage
    featureImage {
      ...ContentfulAsset_width600
    }
  }
`;
