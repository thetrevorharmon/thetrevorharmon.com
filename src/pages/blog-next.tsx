import classnames from 'classnames';
import {graphql} from 'gatsby';
import * as React from 'react';

import {FeaturedPostItem, PostItem} from '../components';
import {Layout} from '../layouts';
import {BlogPost, LinkPost} from '../types';
import {Header, Link, Meta, TextStyle} from '../UI-Kit';
import {Helpers, Routes} from '../utils';

interface Props {
  data: Queries.blogNextPageQueryQuery;
}

export default ({data}: Props) => {
  const pageMetadata: PageMetadata = {
    description: `A collection of my thoughts, typically related to code or design.`,
    title: 'Blog',
    url: Routes.blog(),
  };

  const posts = data.allMdx.nodes;

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
          {/* <FeaturedPostItem post={featuredPost} /> */}
          {posts.map((post) => (
            <div className="space-y-normal">
              <div className="space-y-small">
                <div className="space-y-tiny">
                  <Header rank={2} type="Heading">
                    {post.title}
                  </Header>
                  <Meta
                    date={post.date ?? ''}
                    timeToRead={String(post.timeToRead?.minutes ?? '')}
                  />
                </div>
                <p>
                  <TextStyle style="Body">{post.description}</TextStyle>
                </p>
              </div>

              <Link url={Routes.blogPostNext(post.slug!)} className="block">
                Continue Reading →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query blogNextPageQuery {
    allMdx(sort: {date: DESC}, filter: {type: {ne: "Project"}}) {
      nodes {
        timeToRead {
          minutes
        }
        slug
        title
        description
        link
        date(formatString: "DD MMM YYYY")
        image {
          source {
            id
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
