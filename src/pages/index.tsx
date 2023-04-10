import {graphql} from 'gatsby';
import * as React from 'react';

import {FeaturedTile, PostTile} from '../components';
import {Layout} from '../layouts';
import {Button} from '../UI-Kit';
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
      <h1 className='page'>
        <span>Trevor Harmon</span>
      </h1>
      <p>{tagline}</p>
    </div>
  );

  return (
    <Layout>
      <div className="my-huge">{titleMarkup}</div>
      <div className="space-y-big">
        <FeaturedTile node={featuredPost} />
        {posts.map((post: Mdx) => (
          <PostTile node={post} />
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
