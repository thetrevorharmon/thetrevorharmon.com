import {graphql} from 'gatsby';
import * as React from 'react';

import {Button} from '../UI-Kit';
import {Routes} from '../utils';
import {Post} from './Post';

interface LinkPostProps {
  data: {
    allContentfulLinkPost: {
      edges: [
        {
          node: LinkPost;
        },
      ];
    };
  };
  pageContext: {
    slug: string;
    newerPost?: BasicPost;
    olderPost?: BasicPost;
  };
}

export default (props: LinkPostProps) => {
  const linkPost: LinkPost = {
    ...props.data.allContentfulLinkPost.edges[0].node,
    postType: 'Link',
  };

  const {newerPost, olderPost} = props.pageContext;

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
      timeToRead: linkPost.body.childMarkdownRemark.timeToRead,
    },
    title: linkPost.title,
  };

  const body = {
    bodyHtml: linkPost.body.childMarkdownRemark.html,
    children: <Button href={linkPost.link}>View Link</Button>,
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
    allContentfulLinkPost(filter: {slug: {eq: $slug}}) {
      edges {
        node {
          title
          slug
          link
          date(formatString: "DD MMM YYYY")
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
