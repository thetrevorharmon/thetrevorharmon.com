import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../../../../context/ThemeContext';
import {LinkList} from '../../../../../new-UI-Kit';
import {Routes} from '../../../../../utils';
import * as styles from './PostFooter.module.scss';

interface PostFooterProps {
  olderPost?: BasicPost;
  newerPost?: BasicPost;
}

const PostFooter: React.FC<PostFooterProps> = (props: PostFooterProps) => {
  const theme = useTheme();
  const {olderPost, newerPost} = props;

  const data = [];
  if (olderPost) {
    data.push({
      date: new Date(Date.parse('10/27/2019')), // TODO: put actual date here
      link: {href: Routes.blogPost(olderPost.slug), label: olderPost.title},
    });
  }

  if (newerPost) {
    data.push({
      date: new Date(Date.parse('11/02/2019')), // TODO: put actual date here
      link: {href: Routes.blogPost(newerPost.slug), label: newerPost.title},
    });
  }

  return (
    <div
      className={classnames(styles[`PostFooter-${theme}`], styles.PostFooter)}
    >
      <div className="row">
        {data.length > 0 && (
          <LinkList title="Other things I've written" data={data} />
        )}
      </div>
    </div>
  );
};

export {PostFooter};
