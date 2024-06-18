import {graphql} from 'gatsby';
import React from 'react';

import {FeaturedTile, Button, PostTile, Link, Image} from '../components';
import {Layout} from '../layouts';
import {Routes} from '../utils';
import {SEO} from '../utils/SEO';

interface IndexPageProps {
  data: Queries.IndexPageQuery;
}

function IndexPage({data}: IndexPageProps) {
  if (data.allMdx.nodes.length < 1) {
    return null;
  }

  const [featuredPost, ...posts] = data.allMdx.nodes;

  return (
    <Layout>
      <div className="my-large md:my-large">
        <div className="space-y-large">
          <div className="Breakout flex flex-row items-center space-x-normal md:justify-center">
            <div className="overflow-hidden rounded-full w-16 md:w-24 border border-stone-700 dark:border-stone-400">
              <Image src={{source: data.avatarImage, alt: 'Trevor Harmon'}} />
            </div>
            <h1 className="main">
              Hi! <br className="block sm:hidden" />
              I'm Trevor 👋
            </h1>
          </div>
          <div className="space-y-normal text-md">
            <p>Welcome to my little space on the internet! About me:</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-little gap-y-little">
              <span>👨‍💻</span>
              <p>
                I write code for{' '}
                <Link url="https://www.shopify.com/">Shopify</Link>. I've worked
                on the{' '}
                <Link url="https://www.shopify.com/analytics">analytics</Link>{' '}
                team (called Optimize) for almost 4 years.
              </p>
              <span>🎸</span>
              <p>
                I produce{' '}
                <Link url="https://open.spotify.com/artist/1yO8BBQCwIuADPQA6Pvux6?si=OHbykjIhTpy-NVGXm-tAlQ">
                  music
                </Link>{' '}
                when I'm not writing code.
              </p>
              <span>🎨</span>
              <p>
                I occasionally do{' '}
                <Link url={Routes.projects()}>UI & graphic design</Link>.
              </p>
              <span>⛪️</span>
              <p>
                I'm a devout{' '}
                <Link url="https://www.churchofjesuschrist.org/?lang=eng">
                  Latter-day Saint
                </Link>
                .
              </p>
              <span>📝</span>
              <p>
                I enjoy sharing what I learn on{' '}
                <Link url={Routes.blog()}>my blog</Link>.
              </p>
            </div>
            <p>
              You can learn more about each of these on my{' '}
              <Link url={Routes.about()}>about page</Link>. Thanks for stopping
              by! 👋
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-big">
        <h2>Latest on the blog</h2>
        <FeaturedTile node={featuredPost} />
        <div className="space-y-normal">
          {posts.map((node: Mdx) => (
            <PostTile
              key={node.slug!}
              slug={node.slug}
              title={node.title}
              date={node.date}
              isLinkPost={node.link != null}
            />
          ))}
        </div>
      </div>
      <Button className="mt-large mb-large" url={Routes.blog()}>
        Read more posts &rarr;
      </Button>
    </Layout>
  );
}

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
              gatsbyImageData(width: 700)
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
    avatarImage: file(name: {eq: "avatar"}) {
      childImageSharp {
        gatsbyImageData(width: 400)
      }
    }
  }
`;

export default IndexPage;

export function Head() {
  return <SEO />;
}
