import classnames from 'classnames';
import * as React from 'react';

import * as styles from './Header.module.scss';

import {
  Header as TextHeader,
  Icon,
  Image,
  Link,
} from '../../../../UI-Kit';

interface HeaderProps {
  post: BlogPost;
  layoutClassName: string;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const {
    post,
    layoutClassName,
  } = props;

  const makeAttribution = (attribution: contentfulAttribution) => {
    return (
      <div className={styles.Attribution}>
        {`${attribution.type} by ${attribution.author} on `}
        <Link href={attribution.sourceLocation}>
          {attribution.sourceName}
        </Link>.
      </div>
    );
  };

  return (
    <div
      className={classnames(
        styles.Header,
        'row',
        'mt-4 mb-2',
        'mt-lg-6 mb-lg-4',
      )}
    >
      {
        post.heroImage && (
          <div className={layoutClassName}>
            <Image src={post.heroImage} />
            {post.photoAttribution && makeAttribution(post.photoAttribution)}
          </div>
        )
      }

      <div className={layoutClassName}>
        <TextHeader rank={1} type="Headline" className="mb-0">{post.title}</TextHeader>
        {post.subtitle && (
          <TextHeader rank={2} type="Tagline" className="mt-1">{post.subtitle}</TextHeader>
        )}
        <p className={styles.Meta}>{post.date} • {post.body.childMarkdownRemark.timeToRead} min read</p>
      </div>
    </div>
  );
};

export {
  Header,
};
