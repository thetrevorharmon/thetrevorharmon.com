import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../../../../context/ThemeContext';
import {Attribution, Button} from '../../../../../new-UI-Kit';
import './PostBody.scss';

interface PostBodyProps {
  post: BlogPost | LinkPost;
  layoutClassName: string;
}

const PostBody: React.FC<PostBodyProps> = (props: PostBodyProps) => {
  const {post, layoutClassName} = props;
  const theme = useTheme();

  return (
    <>
      <div className={`post-body ${theme}`}>
        <div className="row">
          <div className={layoutClassName}>
            <div
              dangerouslySetInnerHTML={{
                __html: post.body.childMarkdownRemark.html,
              }}
            />
          </div>
        </div>
      </div>
      {post.postType === 'Blog' && post.sourceAttribution && (
        <div className="row">
          <div className={layoutClassName}>
            <Attribution attribution={post.sourceAttribution} />
          </div>
        </div>
      )}
      {post.postType === 'Link' && post.link && (
        <div className="row mb-lg-9">
          <div className={layoutClassName}>
            <Button href={post.link}>View Link</Button>
          </div>
        </div>
      )}
    </>
  );
};

export {PostBody};
