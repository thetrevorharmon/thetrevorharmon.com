import { graphql } from 'gatsby';
import * as React from 'react';
import Layout from '../../../layouts';

import './blogPostTemplate.scss';

import {
  Header,
  Image,
  Link,
} from '../../../UI-Kit';

import { Routes } from '../../../utils';

type PostNavigationDirection = 'older' | 'newer';

interface CaseStudyTemplateProps {
  data: {
    allContentfulBlogPost: {
      edges: [
        {
          node: BlogPost,
        },
      ],
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

export default class CaseStudyTemplate extends React.Component<CaseStudyTemplateProps, {}> {

  public makeNavigation = (title: string, slug: string, direction: PostNavigationDirection) => {
    const className = `post-link ${direction}-post`;

    return (
      <div className="col-lg-6 post-navigation">
        Read {direction}:<br/>
        <Link href={Routes.blogPost(slug)} className={className}>
          <span className="title">{title}</span>
        </Link>
      </div>
    );
  }

  public render() {

    const blogPost = this.props.data.allContentfulBlogPost.edges[0].node;

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

    const pageLayoutClassName = 'col-lg-8';

    return (
      <Layout className="blog-post-template" pageMetadata={pageMetadata}>
        <div className="row post-header mt-4 mt-lg-6 mb-2 mb-lg-4">
          {
            blogPost.heroImage && (
              <div className={pageLayoutClassName}>
                <Image src={blogPost.heroImage} />
                {blogPost.photoAttribution && makeAttribution(blogPost.photoAttribution)}
              </div>
            )
          }

          <div className={pageLayoutClassName}>
            <Header rank={1} type="Headline" className="mb-0">{blogPost.title}</Header>
            {blogPost.subtitle && (
              <Header rank={2} type="Tagline" className="mt-1">{blogPost.subtitle}</Header>
            )}
            <p className="meta">{blogPost.date} • {blogPost.body.childMarkdownRemark.timeToRead} min read</p>
          </div>
        </div>
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

        <div className="row post-footer">
          {olderPost && this.makeNavigation(olderPost.title, olderPost.slug, 'older')}
          {newerPost && this.makeNavigation(newerPost.title, newerPost.slug, 'newer')}
        </div>
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
  }
`;
