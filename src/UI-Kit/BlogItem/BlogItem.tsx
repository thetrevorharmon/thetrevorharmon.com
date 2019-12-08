import * as React from 'react';

import {Header, Link, Space, Spacer, TextStyle} from '../../UI-Kit';
import {BlogItemProps} from './types';

export const BlogItem = ({
  title,
  meta,
  linkHref,
  description = '',
  className,
}: BlogItemProps) => {
  return (
    <div className={className}>
      <Spacer>
        <Header rank={2} type="Heading">
          {title}
        </Header>
        <Space size="tiny" />
        {meta}
        <Space size="little" />
        <p>
          <TextStyle style="Body">{description}</TextStyle>
        </p>
        <Space size="small" />
        <Link href={linkHref}>Continue Reading →</Link>
      </Spacer>
    </div>
  );
};
