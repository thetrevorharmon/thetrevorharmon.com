import {graphql} from 'gatsby';
import * as React from 'react';

import {FeaturedTile, PostTile} from '../components';
import {Layout} from '../layouts';
import {Routes, SEO} from '../utils';

interface Props {
  data: Queries.BlogPageQuery;
}

const meta = {
  title: 'Blog',
  description:
    'A collection of my thoughts, typically related to code or design.',
};

function BlogPage({data}: Props) {
  const [featuredPost, ...posts] = data.allMdx.nodes;

  const postsByYear = posts.reduce<{[key: number]: Mdx[]}>((years, post) => {
    const postYear = new Date(post.date!).getFullYear();
    if (years[postYear] == null) {
      years[postYear] = [];
    }

    years[postYear].push(post);

    return years;
  }, {});

  const orderedPostsByYear = Object.entries(postsByYear).sort(
    ([firstYear], [secondYear]) => {
      return Number(secondYear) - Number(firstYear);
    },
  );

  return (
    <Layout>
      <div className="my-large md:my-huge space-y-large md:space-y-huge">
        <div className="space-y-tiny">
          <h1 className="featured">
            <span>{meta.title}</span>
          </h1>
          <p>{meta.description}</p>
        </div>

        <div>
          <FeaturedTile node={featuredPost} />
          <div className="space-y-large mt-large">
            {orderedPostsByYear.map(([year, posts]) => {
              return (
                <div className="space-y-normal" key={year}>
                  <h2>{year}</h2>
                  <div className="space-y-normal">
                    {posts.map((node) => (
                      <PostTile node={node} key={node.slug!} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

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

export default BlogPage;

export function Head() {
  return (
    <SEO
      title={meta.title}
      description={meta.description}
      url={Routes.blog()}
    />
  );
}
