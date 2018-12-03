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

  const title = pageMetadata.title
    ? `${pageMetadata.title} | ${data.site.siteMetadata.title}`
    : data.site.siteMetadata.title;

  const description = pageMetadata.description
    ? pageMetadata.description
    : data.site.siteMetadata.description;

  const meta = [
    {
      content: description,
      name: 'Description',
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
          }
        }
      }
    `}
    // tslint:disable-next-line jsx-no-lambda
    render={(data) => <Helmet data={data} {...props} />}
  />
);
