import { graphql, StaticQuery } from 'gatsby';
import * as React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';

interface HelmetProps {
  pageTitle?: string;
  pageDescription?: string;
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
  pageDescription,
}) => {

  const title = pageTitle ? `${pageTitle} | ${data.site.siteMetadata.title}` : data.site.siteMetadata.title;
  const description = pageDescription ? pageDescription : data.site.siteMetadata.description;

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
