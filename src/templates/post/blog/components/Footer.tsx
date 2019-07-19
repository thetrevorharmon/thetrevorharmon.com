import classnames from 'classnames';
import * as React from 'react';

import {
  Link,
} from '../../../../UI-Kit';

import { Routes } from '../../../../utils';

// import * as styles from './Header.module.scss';

interface BasicPost {
  title: string;
  slug: string;
}

interface FooterProps {
  olderPost?: BasicPost;
  newerPost?: BasicPost;
}

type PostNavigationDirection = 'older' | 'newer';

const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  const {
    olderPost,
    newerPost,
  } = props;

  const makeNavigation = (post: BasicPost, direction: PostNavigationDirection) => {
    const {
      title,
      slug,
    } = post;

    const className = `post-link ${direction}-post`;

    return (
      <div className="col-lg-6 post-navigation">
        Read {direction}:<br />
        <Link href={Routes.blogPost(slug)} className={className}>
          <span className="title">{title}</span>
        </Link>
      </div>
    );
  };

  return (
    <div className="post-footer">
      <div className="row post-navigation-wrapper">
        {olderPost && makeNavigation(olderPost, 'older')}
        {newerPost && makeNavigation(newerPost, 'newer')}
      </div>
    </div>
  );
};

export {
  Footer,
};
