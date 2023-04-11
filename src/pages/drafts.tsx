import {graphql} from 'gatsby';
import * as React from 'react';

import {PostTile} from '../components';
import {Layout} from '../layouts';
import {Routes} from '../utils';

interface Props {
  data: Queries.DraftsPageQuery;
}

export default ({data}: Props) => {
  const pageMetadata: PageMetadata = {
    description: `Drafts`,
    title: 'Blog',
    url: Routes.blog(),
  };

  return (
    <Layout pageMetadata={pageMetadata}>
      <div className="mt-huge mb-large space-y-huge">
        <div className="space-y-small">
          <h1 className="featured">
            <span>Drafts</span>
          </h1>
        </div>

        <div className="space-y-large">
          {data.allMdx.nodes.map(
            (post: Queries.BlogPageQuery['allMdx']['nodes'][number]) => (
              <PostTile node={post} />
            ),
          )}
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query DraftsPage {
    allMdx(sort: {date: DESC}, filter: {status: {eq: "Draft"}}) {
      nodes {
        timeToRead
        slug
        title
        description
        link
        date(formatString: "DD MMM YYYY")
        image {
          source {
            childImageSharp {
              gatsbyImageData(width: 800)
            }
          }
          alt
          attribution {
            author
            sourceName
            sourceUrl
          }
        }
        internal {
          contentFilePath
        }
      }
    }
  }
`;
