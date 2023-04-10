import {graphql} from 'gatsby';
import * as React from 'react';

import {FeaturedTile, PostTile} from '../components';
import {Layout} from '../layouts';
import {TextStyle} from '../UI-Kit';
import {Routes} from '../utils';

interface Props {
  data: Queries.BlogPageQuery;
}

export default ({data}: Props) => {
  const pageMetadata: PageMetadata = {
    description: `A collection of my thoughts, typically related to code or design.`,
    title: 'Blog',
    url: Routes.blog(),
  };

  const [featuredPost, ...posts] = data.allMdx.nodes;

  return (
    <Layout pageMetadata={pageMetadata}>
      <div className="mt-huge mb-large space-y-huge">
        <div className="space-y-small">
          <h1 className='page'>
            <span>{pageMetadata.title}</span>
          </h1>
          <p>
            <TextStyle style="Body">{pageMetadata.description}</TextStyle>
          </p>
        </div>

        <div className="space-y-large">
          <FeaturedTile node={featuredPost} />
          {posts.map(
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
  query BlogPage {
    allMdx(
      sort: {date: DESC}
      filter: {type: {eq: "Post"}, status: {eq: "Published"}}
    ) {
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
