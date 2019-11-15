import classnames from 'classnames';
import * as React from 'react';

import {Attribution, Header, Meta} from '../../../../../new-UI-Kit';
import {Image} from '../../../../../UI-Kit';

interface PostHeaderProps {
  post: BlogPost | LinkPost;
  layoutClassName: string;
}

const PostHeader: React.FC<PostHeaderProps> = (props: PostHeaderProps) => {
  const {post, layoutClassName} = props;

  return (
    <div className={classnames('row', 'mt-4 mb-2', 'mt-lg-6 mb-lg-4')}>
      {post.postType === 'Blog' && post.heroImage && (
        <div className={layoutClassName}>
          <Image src={post.heroImage} />
          {post.photoAttribution && (
            <Attribution attribution={post.photoAttribution} />
          )}
        </div>
      )}

      <div className={layoutClassName}>
        <Header rank={1} type="Title" className="mb-0">
          {post.title}
        </Header>
        {/* TODO: Add link header icon */}
        <Meta
          timeToRead={post.body.childMarkdownRemark.timeToRead}
          date={post.date}
        />
      </div>
    </div>
  );
};

export {PostHeader};
