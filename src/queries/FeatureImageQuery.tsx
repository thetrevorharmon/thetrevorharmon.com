import { graphql } from 'gatsby';
import * as React from 'react';

export const FeatureImageFieldsWidth200 = graphql`
  fragment FeatureImageFields_width200 on ContentfulAsset {
    title
    description
    fluid(maxWidth: 200) {
      ...GatsbyContentfulFluid_withWebp
    }
  }
`;

export const FeatureImageFieldsWidth600 = graphql`
  fragment FeatureImageFields_width600 on ContentfulAsset {
    title
    description
    fluid(maxWidth: 600) {
      ...GatsbyContentfulFluid_withWebp
    }
  }
`;
