import {graphql} from 'gatsby';

export const ContentfulProject = graphql`
  fragment ContentfulProject on ContentfulProject {
    title
    projectCompletionDate(formatString: "DD MMM YYYY")
    featureImage {
      ...ContentfulAsset
    }
    description {
      description
    }
    internal {
      type
    }
  }
`;
