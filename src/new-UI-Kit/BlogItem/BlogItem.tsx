import * as React from 'react';

import {Header, Link, Meta, Space, Spacer, TextStyle} from '../../new-UI-Kit';
import {Routes} from '../../utils';

interface BlogItemProps {
  post: BlogPost | LinkPost;
  className?: string;
}

export const BlogItem = ({post, className}: BlogItemProps) => {
  const {
    title,
    body: {
      childMarkdownRemark: {excerpt, timeToRead},
    },
    description,
    slug,
    date,
  } = post;

  return (
    <div className={className}>
      <Spacer>
        <Header rank={2} type="Heading">
          {title}
        </Header>
        <Space size="tiny" />
        {/* TODO: add support for linkpost type (pass link flag) */}
        <Meta date={date} timeToRead={timeToRead} />
        <Space size="little" />
        <p>
          <TextStyle style="Body">{description || excerpt || ''}</TextStyle>
        </p>
        <Space size="small" />
        <Link href={Routes.blogPost(slug)}>Continue Reading →</Link>
      </Spacer>
    </div>
  );
};
