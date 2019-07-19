import { graphql } from 'gatsby';
import * as React from 'react';
import { Layout } from '../../../layouts';

import * as styles from './blogPostTemplate.module.scss';

import {
  PostBody,
  PostFooter,
  PostHeader,
  PostSubscribeForm,
} from './components';

import { Routes } from '../../../utils';

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

    return (
      <Layout className={styles.BlogPostTemplate} pageMetadata={pageMetadata}>
        <PostHeader post={blogPost} layoutClassName={pageLayoutClassName} />
        <PostBody post={blogPost} layoutClassName={pageLayoutClassName} />
        <PostSubscribeForm post={blogPost} layoutClassName={pageLayoutClassName} siteData={siteData} />
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
