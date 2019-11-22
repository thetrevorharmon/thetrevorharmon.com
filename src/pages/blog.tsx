import classnames from 'classnames';
import {graphql} from 'gatsby';
import * as React from 'react';

import {Layout} from '../layouts';
import {BlogItem, FeaturedItem, Header, Spacer, TextStyle} from '../new-UI-Kit';
import {Helpers, Routes} from '../utils';

interface ProjectsPageProps {
  data: {
    allContentfulBlogPost: {
      edges: [
        {
          node: BlogPost;
        },
      ];
    };
    allContentfulLinkPost: {
      edges: [
        {
          node: LinkPost;
        },
      ];
    };
  };
}

export default (props: ProjectsPageProps) => {
  const pageMetadata: PageMetadata = {
    description: `A collection of my thoughts, typically related to code or design.`,
    title: 'Blog',
    url: Routes.blog(),
  };

  const posts = Helpers.combinePostTypes(
    props.data.allContentfulBlogPost,
    props.data.allContentfulLinkPost,
  );

  return (
    <Layout pageMetadata={pageMetadata}>
      <Spacer size="huge">
        <div className="row">
          <div className="col">
            <Spacer size="small">
              <Header
                rank={1}
                type="Display"
                className={classnames('mt-6 mt-lg-8')}
              >
                {pageMetadata.title}
              </Header>
              <p>
                <TextStyle style="Body">{pageMetadata.description}</TextStyle>
              </p>
            </Spacer>
          </div>
        </div>

        {posts.map((post, index) => (
          <Spacer size="large" key={index}>
            <div className="row">
              <div className="col-lg-8">
                {index === 1 ? (
                  // TODO: fix assertion
                  <FeaturedItem post={post as BlogPost} />
                ) : (
                  <BlogItem post={post} />
                )}
              </div>
            </div>
          </Spacer>
        ))}
      </Spacer>
    </Layout>
  );
};

// TODO: figure out featured post
export const query = graphql`
  query blogPageQuery {
    allContentfulBlogPost(sort: {order: DESC, fields: [date]}) {
      edges {
        node {
          title
          slug
          description
          date(formatString: "DD MMM YYYY")
          internal {
            type
          }
          heroImage {
            ...ContentfulAsset_width750
          }
          body {
            childMarkdownRemark {
              html
              excerpt
              timeToRead
            }
          }
          tags
        }
      }
    }
    allContentfulLinkPost(sort: {order: DESC, fields: [date]}) {
      edges {
        node {
          title
          slug
          link
          date(formatString: "DD MMM YYYY")
          internal {
            type
          }
          body {
            childMarkdownRemark {
              html
              excerpt
              timeToRead
            }
          }
        }
      }
    }
  }
`;
