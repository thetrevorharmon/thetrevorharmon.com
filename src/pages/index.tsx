import {graphql} from 'gatsby';
import * as React from 'react';

import {FeaturedTile, PostTile, Button, Link} from '../components';
import {Layout} from '../layouts';
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
    <div className="space-y-tiny">
      <p>Hi there! 👋 I'm</p>
      <h1 className="featured">
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
        <div className="space-y-normal">
          {posts.map((post: Mdx) => (
            <div key={post.slug!}>
              <div>
                <Link url={Routes.blogPost(post.slug!)}>{post.title}</Link>
              </div>
              <div className="text-text-muted dark:text-text-muted-dark">
                {post.date}
              </div>
            </div>
          ))}
        </div>
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
