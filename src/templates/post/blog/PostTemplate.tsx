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

interface PostTemplateProps {
  post: BlogPost | LinkPost;
  siteMetadata: SiteMetadata;
  newerPost?: BasicPost;
  olderPost?: BasicPost;
}

const PostTemplate: React.FC<PostTemplateProps> = ({
  post,
  siteMetadata,
  newerPost,
  olderPost,
}) => {

  const pageMetadata: PageMetadata = {
    description: `${post.description}`,
    image: post.postType === 'Blog' && post.heroImage ? post.heroImage.fluid.src : undefined,
    title: `${post.title}`,
    url: Routes.blogPost(post.slug),
  };

  const pageLayoutClassName = 'col-lg-7';

  return (
    <Layout className={styles.BlogPostTemplate} pageMetadata={pageMetadata}>
      <PostHeader post={post} layoutClassName={pageLayoutClassName} />
      <PostBody post={post} layoutClassName={pageLayoutClassName} />
      <PostSubscribeForm post={post} layoutClassName={pageLayoutClassName} siteData={siteMetadata} />
      <PostFooter olderPost={olderPost} newerPost={newerPost} />
    </Layout>
  );
};

export {
  PostTemplate,
};
