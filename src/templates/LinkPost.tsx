import {graphql} from 'gatsby';
import * as React from 'react';

import {LinkPost} from '../types';
import {Button} from '../UI-Kit';
import {Routes} from '../utils';
import {Post} from './Post';
import {LinkDatePair} from './Post/components/PostFooter';

interface BasicPost {
  title: string;
  slug: string;
}

interface LinkPostProps {
  data: {
    contentfulLinkPost: LinkPost;
  };
  pageContext: {
    slug: string;
    recommendedPosts: LinkDatePair[];
  };
}

export default (props: LinkPostProps) => {
  const linkPost = props.data.contentfulLinkPost;
  const {recommendedPosts} = props.pageContext;

  const metadata = {
    description: linkPost.description
      ? `${linkPost.description}`
      : `${linkPost.body.childMarkdownRemark.excerpt}`,
    title: `${linkPost.title}`,
    url: Routes.blogPost(linkPost.slug),
  };

  const header = {
    meta: {
      date: linkPost.date,
      isLinkPost: true,
      timeToRead: linkPost.body.childMarkdownRemark.timeToRead,
    },
    title: linkPost.title,
  };

  const body = {
    bodyHtml: linkPost.body.childMarkdownRemark.html,
    children: <Button url={linkPost.link}>View Link</Button>,
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
  query ($slug: String!) {
    contentfulLinkPost(slug: {eq: $slug}) {
      ...ContentfulLinkPost
    }
  }
`;
