import {graphql} from 'gatsby';
import * as React from 'react';

import {BlogPost, getContentfulAssetSrc} from '../types';
import {Attribution, Link, Spacer} from '../UI-Kit';
import {Routes, useSiteData} from '../utils';
import {Post} from './Post';
import {LinkDatePair} from './Post/components/PostFooter';

interface BasicPost {
  title: string;
  slug: string;
}

interface BlogPostProps {
  data: {
    contentfulBlogPost: BlogPost;
  };
  pageContext: {
    slug: string;
    recommendedPosts: LinkDatePair[];
  };
}

export default (props: BlogPostProps) => {
  const site = useSiteData();
  const blogPost = props.data.contentfulBlogPost;
  const {recommendedPosts} = props.pageContext;

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

  const footer = {
    data: recommendedPosts,
    getFullLink: Routes.blogPost,
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
    contentfulBlogPost(slug: {eq: $slug}) {
      ...ContentfulBlogPost
      sourceAttribution {
        ...ContentfulAttribution
      }
      photoAttribution {
        ...ContentfulAttribution
      }
    }
  }
`;
