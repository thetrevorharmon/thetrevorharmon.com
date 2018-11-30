import { graphql } from 'gatsby';
import * as React from 'react';

import { FeatureImageFieldsWidth200 } from './queries';

export const ContentfulCaseStudyTile = graphql`
  fragment ContentfulCaseStudyTile on ContentfulCaseStudy {
    title
    slug
    tagline
    featureOnHomepage
    featureImage {
      ...FeatureImageFields_width200
    }
  }
`;

