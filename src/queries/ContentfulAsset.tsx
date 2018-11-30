import { graphql } from 'gatsby';
import * as React from 'react';

export const ContentfulAssetWidth200 = graphql`
  fragment ContentfulAsset_width200 on ContentfulAsset {
    title
    description
    fluid(maxWidth: 200) {
      ...GatsbyContentfulFluid_withWebp
    }
  }
`;

export const ContentfulAssetWidth600 = graphql`
  fragment ContentfulAsset_width600 on ContentfulAsset {
    title
    description
    fluid(maxWidth: 600) {
      ...GatsbyContentfulFluid_withWebp
    }
  }
`;

export const ContentfulAssetWidth750 = graphql`
  fragment ContentfulAsset_width750 on ContentfulAsset {
    title
    description
    fluid(maxWidth: 750) {
      ...GatsbyContentfulFluid_withWebp
    }
  }
`;

export const ContentfulAssetWidth1200 = graphql`
  fragment ContentfulAsset_width1200 on ContentfulAsset {
    title
    description
    fluid(maxWidth: 1200) {
      ...GatsbyContentfulFluid_withWebp
    }
  }
`;
