import * as React from 'react';
import {Layout} from '../../layouts';

import {Form} from '../../components';
import {Container} from '../../layouts/utils';
import {
  PostBody,
  PostBodyProps,
  PostFooter,
  PostFooterProps,
  PostHeader,
  PostHeaderProps,
} from './components';

interface PostProps {
  metadata: PageMetadata;
  header: PostHeaderProps;
  body: PostBodyProps;
  footer: PostFooterProps;
  className?: string;
  hasForm?: boolean;
}

export const Post = ({
  className,
  metadata,
  header,
  body,
  footer,
  hasForm = false,
}: PostProps) => {
  const subscribeForm = hasForm ? (
    <div className="mt-huge mb-large bg-caption-bg dark:bg-caption-bg-dark">
      <Container>
        <Form />
      </Container>
    </div>
  ) : null;

  return (
    <Layout pageMetadata={metadata} hasContainer={false} className={className}>
      <Container>
        <PostHeader {...header} />
        <PostBody {...body} />
      </Container>
      {subscribeForm}
      <Container>
        <PostFooter {...footer} />
      </Container>
    </Layout>
  );
};
