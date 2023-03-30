import {graphql} from 'gatsby';
import * as React from 'react';

import {FeaturedTile, PostMdxItem} from '../components';
import {Layout} from '../layouts';
import {Button, Header} from '../UI-Kit';
import {Routes, useSiteData} from '../utils';

interface IndexPageProps {
  data: Queries.IndexPageQuery;
}

export default ({data}: IndexPageProps) => {
  if (data.allMdx.nodes.length < 1) {
    return null;
  }

  const [featuredPost, ...posts] = data.allMdx.nodes;

  const {tagline} = useSiteData();

  const titleMarkup = (
    <div className="space-y-little">
      <p>Hi there! 👋 I'm</p>
      <Header rank={1} type="Display">
        Trevor Harmon
      </Header>
      <p>{tagline}</p>
    </div>
  );

  return (
    <Layout>
      <div className="my-huge">{titleMarkup}</div>
      <div className="space-y-big">
        <FeaturedTile node={featuredPost} />
        {posts.map((post: Mdx) => (
          <PostMdxItem node={post} />
        ))}
      </div>
      <Button className="mt-big mb-large" url={Routes.blog()}>
        Read more posts &rarr;
      </Button>
    </Layout>
  );
};

export const query = graphql`
  query IndexPage {
    allMdx(
      sort: {date: DESC}
      filter: {type: {eq: "Post"}, status: {eq: null}}
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
