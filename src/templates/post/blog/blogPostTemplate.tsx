import { graphql } from 'gatsby';
import * as React from 'react';
import { Layout } from '../../../layouts';

import './blogPostTemplate.scss';

import {
  Header,
  Icon,
  Image,
  Link,
} from '../../../UI-Kit';

import {
  EmailListForm,
} from '../../../components';

import { Routes } from '../../../utils';

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

    const makeAttribution = (attribution: contentfulAttribution) => {
      const className = `${attribution.type.toLowerCase()}-attribution`;

      return attribution.type === 'Photo'
        ? (
          <div className={className}>
            {`${attribution.type} by ${attribution.author} on `}
            <Link href={attribution.sourceLocation}>
              {attribution.sourceName}
            </Link>.
        </div>
        ) : (
          <div className={className}>
            This {`${attribution.type.toLowerCase()} was originally published on `}
            <Link href={attribution.sourceLocation}>
              {attribution.sourceName}
            </Link>.
        </div>
        );
    };

    const makeNavigation = (title: string, slug: string, direction: PostNavigationDirection) => {
      const className = `post-link ${direction}-post`;

      return (
        <div className="col-lg-6 post-navigation">
          Read {direction}:<br />
          <Link href={Routes.blogPost(slug)} className={className}>
            <span className="title">{title}</span>
          </Link>
        </div>
      );
    };

    const pageLayoutClassName = 'col-lg-7';

    const twitterShareUrl = (siteData: SiteMetadata, blogPost: BlogPost) => {
      const twitterText = encodeURI(`I just finished reading "${blogPost.title}" by ${siteData.twitter.author}`);
      const postAbsoluteUrl = `${siteData.siteUrl}${Routes.blogPost(blogPost.slug)}`;
      const shareUrl = `https://twitter.com/intent/tweet?url=${postAbsoluteUrl}&text=${twitterText}`;

      return shareUrl;
    };

    const makeBody = (post: BlogPost) => {
      return (
        <div className="post-body">

          <div className="row">
            <div className={pageLayoutClassName}>
              <div
                dangerouslySetInnerHTML={{
                  __html: blogPost.body.childMarkdownRemark.html,
                }}
              />
            </div>
          </div>

          {
            blogPost.sourceAttribution && (
              <div className="row">
                <div className={pageLayoutClassName}>
                  {makeAttribution(blogPost.sourceAttribution)}
                </div>
              </div>
            )
          }
        </div>
      );
    };

    const makeHeader = (post: BlogPost) => {
      return (
        <div className="row post-header mt-4 mt-lg-6 mb-2 mb-lg-4">
          {
            post.heroImage && (
              <div className={pageLayoutClassName}>
                <Image src={post.heroImage} />
                {post.photoAttribution && makeAttribution(post.photoAttribution)}
              </div>
            )
          }

          <div className={pageLayoutClassName}>
            <Header rank={1} type="Headline" className="mb-0">{post.title}</Header>
            {post.subtitle && (
              <Header rank={2} type="Tagline" className="mt-1">{post.subtitle}</Header>
            )}
            <p className="meta">{post.date} • {post.body.childMarkdownRemark.timeToRead} min read</p>
          </div>
        </div>
      );
    };

    const makeSignupForm = (siteData: SiteMetadata, post: BlogPost) => {
      return (
        <div className="row my-5 my-lg-6">
          <div className={pageLayoutClassName}>
            <EmailListForm>
              <Link href={siteData.feedUrl} isIconLink={true} className="icon-link">
                <Icon name="rss" />
              </Link>
              <Link href={twitterShareUrl(siteData, post)} isIconLink={true} className="ml-2 icon-link">
                <Icon name="twitter" />
              </Link>
            </EmailListForm>
          </div>
        </div>
      );
    };

    const makeFooter = () => {
      return (
        <div className="post-footer">
          <div className="row post-navigation-wrapper">
            {console.log(`older post: ${olderPost}`)}
            {olderPost && makeNavigation(olderPost.title, olderPost.slug, 'older')}
            {newerPost && makeNavigation(newerPost.title, newerPost.slug, 'newer')}
          </div>
        </div>
      );
    };

    return (
      <Layout className="blog-post-template" pageMetadata={pageMetadata}>
        {makeHeader(blogPost)}
        {makeBody(blogPost)}
        {makeSignupForm(siteData, blogPost)}
        {makeFooter()}
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
