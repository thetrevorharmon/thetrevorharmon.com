import {graphql} from 'gatsby';
import * as React from 'react';

import {FeaturedTile, Button, PostTile} from '../components';
import {Layout} from '../layouts';
import {Routes, nbps, useSiteData} from '../utils';

interface IndexPageProps {
  data: Queries.IndexPageQuery;
}

export default ({data}: IndexPageProps) => {
  if (data.allMdx.nodes.length < 1) {
    return null;
  }

  const [featuredPost, ...posts] = data.allMdx.nodes;

  const {tagline} = useSiteData();

  return (
    <Layout>
      <div className="my-large md:my-huge">
        <div className="space-y-tiny">
          <h1 className="featured">
            <span>Hi, I'm Trevor.{nbps}👋</span>
          </h1>
          <p>{tagline}</p>
        </div>
      </div>
      <div className="space-y-big">
        <FeaturedTile node={featuredPost} />
        <div className="space-y-normal">
          {posts.map((node: Mdx) => (
            <PostTile node={node} key={node.slug!} />
          ))}
        </div>
      </div>
      <Button className="mt-large mb-large" url={Routes.blog()}>
        Read more posts &rarr;
      </Button>
    </Layout>
  );
};

export const query = graphql`
  query IndexPage {
    allMdx(
      sort: {date: DESC}
      filter: {type: {eq: "Post"}, status: {eq: "Published"}}
      limit: 5
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
              gatsbyImageData(height: 420)
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
