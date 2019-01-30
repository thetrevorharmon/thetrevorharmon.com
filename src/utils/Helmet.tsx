import { graphql, StaticQuery, withPrefix } from 'gatsby';
import * as React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';

// import favicon from './favicon.png';

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

  const title = pageMetadata && pageMetadata.title
    ? `${pageMetadata.title} | ${data.site.siteMetadata.title}`
    : data.site.siteMetadata.title;

  const description = pageMetadata && pageMetadata.description
    ? pageMetadata.description
    : data.site.siteMetadata.description;

  const url = pageMetadata && pageMetadata.url
    ? `${data.site.siteMetadata.url}${pageMetadata.url}`
    : data.site.siteMetadata.url;

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
      content: pageMetadata && pageMetadata.title || title,
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
      content: url,
      property: 'og:url',
    },
    {
      content: `${data.site.siteMetadata.url}/favicon.png`,
      property: 'og:image',
    },
    {
      content: 'summary',
      name: 'twitter:card',
    },
    {
      content: '@thetrevorharmon',
      name: 'twitter:site',
    },
    {
      content: '@thetrevorharmon',
      name: 'twitter:creator',
    },
  ];

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
            url
          }
        }
      }
    `}
    // tslint:disable-next-line jsx-no-lambda
    render={(data) => <Helmet data={data} {...props} />}
  />
);
