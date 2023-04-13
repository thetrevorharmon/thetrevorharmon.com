import {graphql} from 'gatsby';
import * as React from 'react';

import {FeaturedTile, Link, PostTile} from '../components';
import {Layout} from '../layouts';
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

  console.log(orderedPostsByYear);

  return (
    <Layout pageMetadata={pageMetadata}>
      <div className="mt-huge mb-large space-y-huge">
        <div className="space-y-small">
          <h1 className="featured">
            <span>{pageMetadata.title}</span>
          </h1>
          <p>{pageMetadata.description}</p>
        </div>

        <div className="space-y-large">
          <FeaturedTile node={featuredPost} />
          <div className="space-y-huge">
            {orderedPostsByYear.map(([year, posts]) => {
              return (
                <div className="space-y-normal" key={year}>
                  <h2>{year}</h2>
                  <div className="space-y-normal">
                    {posts.map((post) => {
                      const icon = post.link
                        ? {
                            icon: {
                              position: 'trailing' as const,
                              name: 'link' as const,
                            },
                          }
                        : undefined;

                      return (
                        <div key={post.slug!}>
                          <div>
                            <Link url={Routes.blogPost(post.slug!)} {...icon}>
                              {post.title}
                            </Link>
                            {/* {post.link ? ' 🔗' : ''} */}
                          </div>
                          <div className="text-text-muted dark:text-text-muted-dark">
                            {post.date}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          {/* {posts.map(
            (post: Queries.BlogPageQuery['allMdx']['nodes'][number]) => (
              <PostTile node={post} />
            ),
          )} */}
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
