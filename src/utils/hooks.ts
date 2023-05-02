import {graphql, useStaticQuery} from 'gatsby';

export const useSiteData = (): SiteMetadata => {
  const {
    site,
  }: {
    site: {
      siteMetadata: SiteMetadata;
    };
  } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          tagline
          siteUrl
          feedUrl
          twitterHandle
        }
      }
    }
  `);

  return site.siteMetadata;
};
