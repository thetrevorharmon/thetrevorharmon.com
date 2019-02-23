import { graphql, StaticQuery, useStaticQuery, withPrefix } from 'gatsby';
import * as React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';

import { checkHttp, MetaTags } from '../utils';

interface HelmetProps {
  pageMetadata: PageMetadata;
}

interface HelmetData {
  site: {
    siteMetadata: SiteMetadata,
  };
}

const Helmet: React.SFC<HelmetProps> = ({
  children,
  pageMetadata,
}) => {

  const data: HelmetData = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          siteUrl
          twitter {
            author
            site
          }
        }
      }
    }
  `);

  const page = pageMetadata;
  const site = data.site.siteMetadata;

  const title = page.title
    ? `${page.title} | ${site.title}`
    : site.title;

  const extraMeta = [
    {
      content: page.description || site.description,
      name: 'Description',
    },
  ];

  const meta = MetaTags({
    basic: {
      image: page.image ? checkHttp(page.image) : `${site.siteUrl}/favicon.png`,
      title: page.title || site.title,
      url: page.url ? `${site.siteUrl}${page.url}/` : site.siteUrl,
    },
    optional: {
      description: page.description || site.description,
      siteName: site.title,
    },
    twitter: {
      authorHandle: site.twitter.author,
      siteHandle: site.twitter.site,
    },
  }, extraMeta);

  return (
    <ReactHelmet
      title={title}
      meta={meta}
    >
      <html lang="en" />

    </ReactHelmet>
  );
};

Helmet.defaultProps = {
  pageMetadata: {},
};

export default Helmet;
