import {graphql} from 'gatsby';
import * as React from 'react';

import {Link} from '../components';
import {Layout} from '../layouts';
import {Routes} from '../utils';
import {SEO} from '../utils/SEO';

interface Props {
  data: Queries.DraftsPageQuery;
}

function DraftsPage({data}: Props) {
  return (
    <Layout>
      <div className="mt-huge mb-large space-y-huge">
        <div className="space-y-small">
          <h1 className="featured">
            <span>Drafts</span>
          </h1>
        </div>

        <div className="space-y-normal">
          {data.allMdx.nodes.map(
            (post: Queries.BlogPageQuery['allMdx']['nodes'][number]) => (
              <div key={post.slug!}>
                <Link url={Routes.blogPost(post.slug!)}>{post.title}</Link>
                <div className="text-text-muted dark:text-text-muted-dark">
                  {post.date}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </Layout>
  );
}

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

export function Head() {
  return <SEO title="Drafts" url={Routes.drafts()} noIndex />;
}

export default DraftsPage;
