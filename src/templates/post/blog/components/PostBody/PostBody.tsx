import classnames from 'classnames';
import * as React from 'react';

import {
  Button,
  Link,
} from '../../../../../UI-Kit';

import * as styles from './PostBody.module.scss';
import './PostBody.scss';

interface PostBodyProps {
  post: BlogPost | LinkPost;
  layoutClassName: string;
}

const PostBody: React.FC<PostBodyProps> = (props: PostBodyProps) => {
  const {
    post,
    layoutClassName,
  } = props;

  const makeSourceAttribution = (attribution: ContentfulAttribution) => {
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
        post.postType === 'Blog' && post.sourceAttribution && (
          <div className="row">
            <div className={layoutClassName}>
              {makeSourceAttribution(post.sourceAttribution)}
            </div>
          </div>
        )
      }
      {
        post.postType === 'Link' && post.link && (
          <div className="row mb-lg-9">
            <div className={layoutClassName}>
              <Button href={post.link}>View Link</Button>
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
