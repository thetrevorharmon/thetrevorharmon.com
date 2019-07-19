import classnames from 'classnames';
import * as React from 'react';

import * as styles from './PostHeader.module.scss';

import {
  Header,
  Icon,
  Image,
  Link,
} from '../../../../../UI-Kit';

interface PostHeaderProps {
  post: BlogPost | LinkPost;
  layoutClassName: string;
}

const PostHeader: React.FC<PostHeaderProps> = (props: PostHeaderProps) => {
  const {
    post,
    layoutClassName,
  } = props;

  const makeAttribution = (attribution: ContentfulAttribution) => {
    return (
      <div className={styles.Attribution}>
        {`${attribution.type} by ${attribution.author} on `}
        <Link href={attribution.sourceLocation}>
          {attribution.sourceName}
        </Link>.
      </div>
    );
  };

  const header = (className?: string) => (
    <Header
      rank={1}
      type="Headline"
      className={classnames(
        'mb-0',
        className,
      )}
    >
      {post.title}
    </Header>
  );

  return (
    <div
      className={classnames(
        styles.PostHeader,
        'row',
        'mt-4 mb-2',
        'mt-lg-6 mb-lg-4',
      )}
    >
      {
        post.postType === 'Blog' && post.heroImage && (
          <div className={layoutClassName}>
            <Image src={post.heroImage} />
            {post.photoAttribution && makeAttribution(post.photoAttribution)}
          </div>
        )
      }

      <div className={layoutClassName}>
        {
          post.postType === 'Link' && post.link ? (
            <Link href={post.link} className={styles.Link}>
              <div className={styles.Wrapper}>
                {header(styles.LinkHeader)}
                <Icon className={styles.Icon} name="link" />
              </div>
            </Link>
          ) : (
            <>
              {header()}
            </>
          )
        }
        {post.subtitle && (
          <Header rank={2} type="Tagline" className="mt-1">{post.subtitle}</Header>
        )}
        <p className={styles.Meta}>{post.date} • {post.body.childMarkdownRemark.timeToRead} min read</p>
      </div>
    </div>
  );
};

export {
  PostHeader,
};
