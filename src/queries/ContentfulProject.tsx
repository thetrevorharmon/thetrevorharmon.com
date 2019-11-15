import {graphql} from 'gatsby';
import * as React from 'react';

export const ContentfulProjectTile = graphql`
  fragment ContentfulProjectTile on ContentfulProject {
    title
    slug
    featureOnHomepage
    projectCompletionDate(formatString: "DD MMM YYYY")
    featureImage {
      ...ContentfulAsset_width600
    }
  }
`;
