import {graphql} from 'gatsby';
import * as React from 'react';

import {BlogPost, getContentfulAssetSrc} from '../types';
import {Attribution, Link, Spacer} from '../UI-Kit';
import {Routes, useSiteData} from '../utils';
import {Post} from './Post';

interface BasicPost {
  title: string;
  slug: string;
}

interface BlogPostProps {
  data: {
    allContentfulBlogPost: allContentfulEdgesWithNode<BlogPost>;
  };
  pageContext: {
    slug: string;
    newerPost?: BasicPost;
    olderPost?: BasicPost;
  };
}

export default (props: BlogPostProps) => {
  const site = useSiteData();
  const blogPost = props.data.allContentfulBlogPost.edges[0].node;
  const {newerPost, olderPost} = props.pageContext;

  const metadata = {
    description: blogPost.description
      ? blogPost.description
      : blogPost.body.childMarkdownRemark.excerpt,
    image: blogPost.heroImage
      ? getContentfulAssetSrc(blogPost.heroImage)
      : undefined,
    title: blogPost.title,
    url: Routes.blogPost(blogPost.slug),
  };

  const header = {
    image: blogPost.heroImage,
    meta: {
      date: blogPost.date,
      timeToRead: blogPost.body.childMarkdownRemark.timeToRead,
    },
    photoAttribution: blogPost.photoAttribution,
    title: blogPost.title,
  };

  const twitterUrl = `https://mobile.twitter.com/search?q=${encodeURI(
    [site.siteUrl, Routes.blogPost(blogPost.slug)].join(''),
  )}`;

  const body = {
    bodyHtml: blogPost.body.childMarkdownRemark.html,
    children: (
      <Spacer size="tiny">
        {blogPost.sourceAttribution && (
          <Attribution attribution={blogPost.sourceAttribution} />
        )}
        <Link url={twitterUrl}>Reply to this post on Twitter</Link>
      </Spacer>
    ),
  };

  const footerData = [];
  if (olderPost) {
    footerData.push({
      date: new Date(Date.parse('10/27/2019')), // TODO: put actual date here
      link: {href: Routes.blogPost(olderPost.slug), label: olderPost.title},
    });
  }

  if (newerPost) {
    footerData.push({
      date: new Date(Date.parse('11/02/2019')), // TODO: put actual date here
      link: {href: Routes.blogPost(newerPost.slug), label: newerPost.title},
    });
  }

  const footer = {
    data: footerData,
    title: `Other things I've written`,
  };

  return (
    <Post
      metadata={metadata}
      header={header}
      body={body}
      footer={footer}
      hasForm={true}
    />
  );
};

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
          description
          date(formatString: "DD MMM YYYY")
          body {
            childMarkdownRemark {
              html
              excerpt
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
          internal {
            type
          }
        }
      }
    }
  }
`;
