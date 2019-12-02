import * as React from 'react';
import {Layout} from '../../../layouts';

import {Container} from '../../../layouts/utils';
import {Space, Spacer} from '../../../new-UI-Kit';
import * as styles from './PostTemplate.module.scss';

import {
  PostBody,
  PostFooter,
  PostHeader,
  PostSubscribeForm,
} from './components';

import {Routes} from '../../../utils';

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
    description: post.description
      ? `${post.description}`
      : `${post.body.childMarkdownRemark.excerpt}`,
    image:
      post.postType === 'Blog' && post.heroImage
        ? post.heroImage.fluid.src
        : undefined,
    title: `${post.title}`,
    url: Routes.blogPost(post.slug),
  };

  return (
    <Layout
      className={styles.BlogPostTemplate}
      pageMetadata={pageMetadata}
      hasContainer={false}
    >
      <Container>
        <Spacer>
          <PostHeader post={post} />
          <Space size="large" />
        </Spacer>
        <PostBody post={post} />
      </Container>
      <Spacer>
        <Space size="huge" />
        <PostSubscribeForm />
        <Space size="large" />
      </Spacer>
      <Container>
        <Spacer>
          <PostFooter olderPost={olderPost} newerPost={newerPost} />
        </Spacer>
      </Container>
    </Layout>
  );
};

export {PostTemplate};
