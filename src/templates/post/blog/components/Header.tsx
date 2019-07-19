import * as React from 'react';

import {
  Header as TextHeader,
  Icon,
  Image,
  Link,
} from '../../../../UI-Kit';

interface HeaderProps {
  post: BlogPost;
  className: string;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const {
    post,
    className,
  } = props;

  const makeAttribution = (attribution: contentfulAttribution) => {
    const className = `${attribution.type.toLowerCase()}-attribution`;

    return attribution.type === 'Photo'
      ? (
        <div className={className}>
          {`${attribution.type} by ${attribution.author} on `}
          <Link href={attribution.sourceLocation}>
            {attribution.sourceName}
          </Link>.
        </div>
      ) : null;
  };

  return (
    <div className="row post-header mt-4 mt-lg-6 mb-2 mb-lg-4">
      {
        post.heroImage && (
          <div className={className}>
            <Image src={post.heroImage} />
            {post.photoAttribution && makeAttribution(post.photoAttribution)}
          </div>
        )
      }

      <div className={className}>
        <TextHeader rank={1} type="Headline" className="mb-0">{post.title}</TextHeader>
        {post.subtitle && (
          <TextHeader rank={2} type="Tagline" className="mt-1">{post.subtitle}</TextHeader>
        )}
        <p className="meta">{post.date} • {post.body.childMarkdownRemark.timeToRead} min read</p>
      </div>
    </div>
  );
};

export {
  Header,
};
