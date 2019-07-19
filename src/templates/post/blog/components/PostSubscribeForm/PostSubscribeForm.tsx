import classnames from 'classnames';
import * as React from 'react';

import {
  Icon,
  Link,
} from '../../../../../UI-Kit';

import {
  EmailListForm,
} from '../../../../../components';

import { Helpers } from '../../../../../utils';

import * as styles from './PostSubscribeForm.module.scss';

interface PostSubscribeFormProps {
  layoutClassName: string;
  post: BlogPost;
  siteData: SiteMetadata;
}

type PostNavigationDirection = 'Older' | 'Newer';

const PostSubscribeForm: React.FC<PostSubscribeFormProps> = (props: PostSubscribeFormProps) => {
  const {
    layoutClassName,
    post,
    siteData,
  } = props;

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
            href={Helpers.twitterShareUrl(post, siteData)}
            isIconLink={true}
            className={classnames(
              styles.IconLink,
              'ml-2',
            )}
          >
            <Icon name="twitter" />
          </Link>
        </EmailListForm>
      </div>
    </div>
  );
};

export {
  PostSubscribeForm,
};
