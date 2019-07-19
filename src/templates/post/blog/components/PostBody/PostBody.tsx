import classnames from 'classnames';
import * as React from 'react';

import {
  Link,
} from '../../../../../UI-Kit';

import * as styles from './PostBody.module.scss';
import './PostBody.scss';

interface PostBodyProps {
  post: BlogPost;
  layoutClassName: string;
}

const PostBody: React.FC<PostBodyProps> = (props: PostBodyProps) => {
  const {
    post,
    layoutClassName,
  } = props;

  const makeAttribution = (attribution: ContentfulAttribution) => {
    return (
      <div className={styles.Attribution}>
        This {`${attribution.type.toLowerCase()} was originally published on `}
        <Link href={attribution.sourceLocation}>
          {attribution.sourceName}
        </Link>.
      </div>
    );
  };

  return (
    <>
      <div className="post-body">
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
      {
        post.sourceAttribution && (
          <div className="row">
            <div className={layoutClassName}>
              {makeAttribution(post.sourceAttribution)}
            </div>
          </div>
        )
      }
    </>
  );
};

export {
  PostBody,
};
