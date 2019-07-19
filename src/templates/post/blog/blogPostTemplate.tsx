import { graphql } from 'gatsby';
import * as React from 'react';
import { Layout } from '../../../layouts';

import './blogPostTemplate.scss';

import {
  Icon,
  Link,
} from '../../../UI-Kit';

import {
  PostBody,
  PostFooter,
  PostHeader,
} from './components';

import {
  EmailListForm,
} from '../../../components';

import { Routes, Helpers } from '../../../utils';

type PostNavigationDirection = 'older' | 'newer';

interface BlogPostTemplateProps {
  data: {
    allContentfulBlogPost: {
      edges: [
        {
          node: BlogPost,
        },
      ],
    },
    site: {
      siteMetadata: SiteMetadata,
    },
  };
  pageContext: {
    slug: string,
    newerPost?: {
      title: string,
      slug: string,
    },
    olderPost?: {
      title: string,
      slug: string,
    },
  };
}

export default class BlogPostTemplate extends React.Component<BlogPostTemplateProps, {}> {

  public render() {

    const blogPost = this.props.data.allContentfulBlogPost.edges[0].node;
    const siteData = this.props.data.site.siteMetadata;

    const {
      slug,
      newerPost,
      olderPost,
    } = this.props.pageContext;

    const pageMetadata: PageMetadata = {
      description: `${blogPost.description}`,
      image: blogPost.heroImage && blogPost.heroImage.fluid.src,
      title: `${blogPost.title}`,
      url: Routes.blogPost(slug),
    };

    const pageLayoutClassName = 'col-lg-7';

    const makeSignupForm = (siteData: SiteMetadata, post: BlogPost) => {
      return (
        <div className="row my-5 my-lg-6">
          <div className={pageLayoutClassName}>
            <EmailListForm>
              <Link href={siteData.feedUrl} isIconLink={true} className="icon-link">
                <Icon name="rss" />
              </Link>
              <Link href={Helpers.twitterShareUrl(post, siteData)} isIconLink={true} className="ml-2 icon-link">
                <Icon name="twitter" />
              </Link>
            </EmailListForm>
          </div>
        </div>
      );
    };

    return (
      <Layout className="blog-post-template" pageMetadata={pageMetadata}>
        <PostHeader post={blogPost} layoutClassName={pageLayoutClassName} />
        <PostBody post={blogPost} layoutClassName={pageLayoutClassName} />
        {makeSignupForm(siteData, blogPost)}
        <PostFooter olderPost={olderPost} newerPost={newerPost} />
      </Layout>
    );
  }
}

export const query = graphql`
  query($slug: String!) {
    allContentfulBlogPost(filter: {slug: {eq: $slug}}) {
      edges {
        node {
          heroImage {
            ...ContentfulAsset_width750
          }
          title
          slug
          subtitle
          description
          date(formatString: "MMMM DD, YYYY")
          body {
            childMarkdownRemark {
              html
              timeToRead
            }
          }
          tags
          sourceAttribution {
            ...ContentfulAttribution
          }
          photoAttribution {
            ...ContentfulAttribution
          }
        }
      }
    }
    site {
      siteMetadata {
        siteUrl
        feedUrl
        twitter {
          author
        }
      }
    }
  }
`;
