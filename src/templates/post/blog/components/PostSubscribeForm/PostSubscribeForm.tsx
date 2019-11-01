import classnames from 'classnames';
import * as React from 'react';

import {Icon, Link} from '../../../../../UI-Kit';

import {EmailListForm} from '../../../../../components';

import {Routes} from '../../../../../utils';

import * as styles from './PostSubscribeForm.module.scss';

interface PostSubscribeFormProps {
  layoutClassName: string;
  post: BlogPost | LinkPost;
  siteData: SiteMetadata;
}

const PostSubscribeForm: React.FC<PostSubscribeFormProps> = (
  props: PostSubscribeFormProps,
) => {
  const {layoutClassName, post, siteData} = props;

  const twitterShareUrl = (() => {
    const twitterText = encodeURI(
      `I just finished reading "${post.title}" by ${siteData.twitter.author}`,
    );
    const postAbsoluteUrl = `${siteData.siteUrl}${Routes.blogPost(post.slug)}`;
    const shareUrl = `https://twitter.com/intent/tweet?url=${postAbsoluteUrl}&text=${twitterText}`;

    return shareUrl;
  })();

  return (
    <div className="row my-5 my-lg-6">
      <div className={layoutClassName}>
        <EmailListForm>
          <Link
            href={siteData.feedUrl}
            isIconLink={true}
            className={styles.IconLink}
          >
            <Icon name="rss" />
          </Link>
          <Link
            href={twitterShareUrl}
            isIconLink={true}
            className={classnames(styles.IconLink, 'ml-2')}
          >
            <Icon name="twitter" />
          </Link>
        </EmailListForm>
      </div>
    </div>
  );
};

export {PostSubscribeForm};
