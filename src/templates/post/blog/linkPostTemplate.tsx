import { graphql } from 'gatsby';
import * as React from 'react';
import { Layout } from '../../../layouts';

import './LinkPostTemplate.scss';

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

interface LinkPostTemplateProps {
  data: {
    allContentfulLinkPost: {
      edges: [
        {
          node: LinkPost,
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

export default class LinkPostTemplate extends React.Component<LinkPostTemplateProps, {}> {

  public makeNavigation = (title: string, slug: string, direction: PostNavigationDirection) => {
    const className = `post-link ${direction}-post`;

    return (
      <div className="col-lg-6 post-navigation">
        Read {direction}:<br />
        <Link href={Routes.blogPost(slug)} className={className}>
          <span className="title">{title}</span>
        </Link>
      </div>
    );
  }

  public twitterShareUrl = (siteData: SiteMetadata, blogPost: (BlogPost | LinkPost)) => {
    const twitterText = encodeURI(`I just finished reading "${blogPost.title}" by ${siteData.twitter.author}`);
    const postAbsoluteUrl = `${siteData.siteUrl}${Routes.blogPost(blogPost.slug)}`;
    const shareUrl = `https://twitter.com/intent/tweet?url=${postAbsoluteUrl}&text=${twitterText}`;

    return shareUrl;
  }

  public render() {

    const linkPost = this.props.data.allContentfulLinkPost.edges[0].node;
    const siteData = this.props.data.site.siteMetadata;

    const {
      slug,
      newerPost,
      olderPost,
    } = this.props.pageContext;

    const pageMetadata: PageMetadata = {
      description: `${linkPost.description}`,
      // image: blogPost.heroImage && blogPost.heroImage.fluid.src,
      title: `${linkPost.title}`,
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

    const pageLayoutClassName = 'col-lg-7';

    return (
      <Layout className="blog-post-template" pageMetadata={pageMetadata}>
        <div className="row post-header mt-4 mt-lg-6 mb-2 mb-lg-4">
          {/* {
            blogPost.heroImage && (
              <div className={pageLayoutClassName}>
                <Image src={blogPost.heroImage} />
                {blogPost.photoAttribution && makeAttribution(blogPost.photoAttribution)}
              </div>
            )
          } */}

          <div className={pageLayoutClassName}>
            <Header rank={1} type="Headline" className="mb-0">{linkPost.title}</Header>
            {linkPost.subtitle && (
              <Header rank={2} type="Tagline" className="mt-1">{linkPost.subtitle}</Header>
            )}
            <p className="meta">{linkPost.date} • {linkPost.body.childMarkdownRemark.timeToRead} min read</p>
          </div>
        </div>
        <div className="post-body">

          <div className="row">
            <div className={pageLayoutClassName}>
              <div
                dangerouslySetInnerHTML={{
                  __html: linkPost.body.childMarkdownRemark.html,
                }}
              />
            </div>
          </div>

          {/* {
            blogPost.sourceAttribution && (
              <div className="row">
                <div className={pageLayoutClassName}>
                  {makeAttribution(blogPost.sourceAttribution)}
                </div>
              </div>
            )
          } */}
        </div>
        <div className="row my-5 my-lg-6">
          <div className={pageLayoutClassName}>
            <EmailListForm>
              <Link href={siteData.feedUrl} isIconLink={true} className="icon-link">
                <Icon name="rss" />
              </Link>
              <Link href={this.twitterShareUrl(siteData, linkPost)} isIconLink={true} className="ml-2 icon-link">
                <Icon name="twitter" />
              </Link>
            </EmailListForm>
          </div>
        </div>
        <div className="post-footer">
          <div className="row post-navigation-wrapper">
            {olderPost && this.makeNavigation(olderPost.title, olderPost.slug, 'older')}
            {newerPost && this.makeNavigation(newerPost.title, newerPost.slug, 'newer')}
          </div>
        </div>
      </Layout>
    );
  }
}

export const query = graphql`
  query($slug: String!) {
    allContentfulLinkPost(filter: {slug: {eq: $slug}}) {
      edges {
        node {
          title
          slug
          link
          date(formatString: "MMMM DD, YYYY")
          body {
            childMarkdownRemark {
              html
              timeToRead
            }
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
