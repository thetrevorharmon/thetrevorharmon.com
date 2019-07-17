import { graphql } from 'gatsby';
import * as React from 'react';

export const ContentfulAttribution = graphql`
  fragment ContentfulAttribution on ContentfulAttribution {
    name
    sourceLocation
    sourceName
    author
    type
  }
`;
