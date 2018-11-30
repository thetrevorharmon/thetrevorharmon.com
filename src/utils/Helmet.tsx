import { graphql, StaticQuery } from 'gatsby';
import * as React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';

interface HelmetProps {
  pageTitle?: string;
}

interface HelmetDataProps extends HelmetProps {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
      },
    },
  };
}

const Helmet: React.SFC<HelmetDataProps> = ({
  children,
  data,
  pageTitle,
}) => {

  const siteTitle = pageTitle ? `${pageTitle} | ${data.site.siteMetadata.title}` : data.site.siteMetadata.title;

  return (
    <ReactHelmet>
      <html lang="en" />
        <title>{siteTitle}</title>
        <meta name="Description" content={data.site.siteMetadata.description} />
    </ReactHelmet>
  );
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
