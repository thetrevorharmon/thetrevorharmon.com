import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../../../../context/ThemeContext';
import {Attribution, Button, Spacer} from '../../../../../UI-Kit';
import './PostBody.scss';

interface PostBodyProps {
  post: BlogPost | LinkPost;
}

const PostBody: React.FC<PostBodyProps> = (props: PostBodyProps) => {
  const {post} = props;
  const theme = useTheme();

  return (
    <Spacer size="medium">
      <div className={classnames(['post-body', theme])}>
        <div
          dangerouslySetInnerHTML={{
            __html: post.body.childMarkdownRemark.html,
          }}
        />
      </div>
      {post.postType === 'Blog' && post.sourceAttribution && (
        <Attribution attribution={post.sourceAttribution} />
      )}
      {post.postType === 'Link' && post.link && (
        <Button href={post.link}>View Link</Button>
      )}
      {/* TODO: Add 'discuss this on twitter' link */}
    </Spacer>
  );
};

export {PostBody};
