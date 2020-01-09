import * as React from 'react';
import {Layout} from '../../layouts';

import {Form} from '../../components';
import {useTheme} from '../../context/ThemeContext';
import {Container} from '../../layouts/utils';
import {Space, Spacer} from '../../UI-Kit';
import {
  PostBody,
  PostBodyProps,
  PostFooter,
  PostFooterProps,
  PostHeader,
  PostHeaderProps,
} from './components';
import * as styles from './Post.module.scss';

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
  const theme = useTheme();

  const subscribeForm = hasForm ? (
    <Spacer>
      <Space size="huge" />
      <div className={styles[`FormContainer-${theme}`]}>
        <Container>
          <Form />
        </Container>
      </div>
      <Space size="large" />
    </Spacer>
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
