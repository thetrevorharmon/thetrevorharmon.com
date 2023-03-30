import {graphql} from 'gatsby';
import * as React from 'react';

import {FeaturedMdxItem, PostMdxItem} from '../components';
import {Layout} from '../layouts';
import {Header, TextStyle} from '../UI-Kit';
import {Routes} from '../utils';

interface Props {
  data: Queries.BlogPageNextQuery;
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
          <Header rank={1} type="Display">
            {pageMetadata.title}
          </Header>
          <p>
            <TextStyle style="Body">{pageMetadata.description}</TextStyle>
          </p>
        </div>

        <div className="space-y-large">
          <FeaturedMdxItem node={featuredPost} />
          {posts.map(
            (post: Queries.BlogPageNextQuery['allMdx']['nodes'][number]) => (
              <PostMdxItem node={post} />
            ),
          )}
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query BlogPageNext {
    allMdx(sort: {date: DESC}, filter: {type: {eq: "Post"}}) {
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
