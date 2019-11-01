import classnames from 'classnames';
import * as React from 'react';

import * as styles from './PostHeader.module.scss';

import {
  Header,
  Icon,
  Image,
  Link,
  LinkHeader,
  Meta,
} from '../../../../../UI-Kit';

import {Helpers} from '../../../../../utils';

interface PostHeaderProps {
  post: BlogPost | LinkPost;
  layoutClassName: string;
}

const PostHeader: React.FC<PostHeaderProps> = (props: PostHeaderProps) => {
  const {post, layoutClassName} = props;

  const makeAttribution = (attribution: ContentfulAttribution) => {
    return (
      <div className={styles.Attribution}>
        {`${attribution.type} by ${attribution.author} on `}
        <Link href={attribution.sourceLocation}>{attribution.sourceName}</Link>.
      </div>
    );
  };

  const makeHeader = (className?: string) => {
    const rank = 1;
    const type = 'Headline';
    const classname = classnames('mb-0', className);

    return post.postType === 'Link' ? (
      <LinkHeader
        rank={rank}
        type={type}
        className={classname}
        href={post.link}
        hasLinkIcon={true}
      >
        {post.title}
      </LinkHeader>
    ) : (
      <Header rank={rank} type={type} className={classname}>
        {post.title}
      </Header>
    );
  };

  return (
    <div
      className={classnames(
        styles.PostHeader,
        'row',
        'mt-4 mb-2',
        'mt-lg-6 mb-lg-4'
      )}
    >
      {post.postType === 'Blog' && post.heroImage && (
        <div className={layoutClassName}>
          <Image src={post.heroImage} />
          {post.photoAttribution && makeAttribution(post.photoAttribution)}
        </div>
      )}

      <div className={layoutClassName}>
        {makeHeader()}
        <Meta post={post} />
      </div>
    </div>
  );
};

export {PostHeader};
