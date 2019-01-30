import { graphql, StaticQuery } from 'gatsby';
import * as React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';

interface HelmetProps {
  pageMetadata?: PageMetadata;
}

interface HelmetDataProps extends HelmetProps {
  data: {
    site: {
      siteMetadata: SiteMetadata,
    },
  };
}

const Helmet: React.SFC<HelmetDataProps> = ({
  children,
  data,
  pageMetadata,
}) => {

  const title = pageMetadata && pageMetadata.pageTitle
    ? `${pageMetadata.pageTitle} | ${data.site.siteMetadata.title}`
    : data.site.siteMetadata.title;

  const description = pageMetadata && pageMetadata.description
    ? pageMetadata.description
    : data.site.siteMetadata.description;

  const meta = [
    {
      content: description,
      name: 'Description',
    },
    {
      content: 'website',
      property: 'og:type',
    },
    {
      content: pageMetadata && pageMetadata.pageTitle || title,
      property: 'og:title',
    },
    {
      content: description,
      property: 'og:description',
    },
    {
      content: data.site.siteMetadata.title,
      property: 'og:site_name',
    },
    {
      content: `${data.site.siteMetadata.siteUrl}`,
      property: 'og:url',
    },
  ];

// <meta name="twitter:card" content="summary" />
// <meta name="twitter:site" content="@nytimesbits" />
// <meta name="twitter:creator" content="@nickbilton" />
// <meta property="og:url" content="http://bits.blogs.nytimes.com/2011/12/08/a-twitter-for-my-sister/" />
// <meta property="og:title" content="A Twitter for My Sister" />
// <meta property="og:description" content="In the early days, Twitter grew so quickly that it was almost impossible to add new features because engineers spent their time trying to keep the rocket ship from stalling." />
// <meta property="og:image" content="http://graphics8.nytimes.com/images/2011/12/08/technology/bits-newtwitter/bits-newtwitter-tmagArticle.jpg" />

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

export default (props: HelmetProps) => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
          }
        }
      }
    `}
    // tslint:disable-next-line jsx-no-lambda
    render={(data) => <Helmet data={data} {...props} />}
  />
);
