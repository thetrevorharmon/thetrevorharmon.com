import { graphql, StaticQuery } from 'gatsby';
import * as React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';

const Helmet: React.SFC<{}> = ({children}) => {
  return (
    <StaticQuery
      query={graphql`
        query HeadingQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      // tslint:disable-next-line jsx-no-lambda
      render={(data) => (
        <ReactHelmet>
          <title>{data.site.siteMetadata.title}</title>
          {children}
        </ReactHelmet>
      )}
    />
  );
};

export default Helmet;
