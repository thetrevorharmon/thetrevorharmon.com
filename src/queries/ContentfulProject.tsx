import { graphql } from 'gatsby';
import * as React from 'react';

import { FeatureImageFieldsWidth600 } from './queries';

export const ContentfulProjectTile = graphql`
  fragment ContentfulProjectTile on ContentfulProject {
    title
    slug
    featureOnHomepage
    featureImage {
      ...FeatureImageFields_width600
    }
  }
`;
