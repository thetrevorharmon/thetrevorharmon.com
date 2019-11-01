import {graphql} from 'gatsby';
import * as React from 'react';

export const ContentfulCaseStudyTile = graphql`
  fragment ContentfulCaseStudyTile on ContentfulCaseStudy {
    title
    slug
    tagline
    featureOnHomepage
    featureImage {
      ...ContentfulAsset_width200
    }
  }
`;
