import classnames from 'classnames';
import * as React from 'react';

import {Header, Link} from '../../../../UI-Kit';
import {LinkDatePair, PostFooterProps} from './types';

export const PostFooter = ({title, getFullLink, data}: PostFooterProps) => {
  if (data.length < 1) {
    return null;
  }

  const makePairMarkup = ({link: {slug, label}, date}: LinkDatePair) => {
    return (
      <div className="flex flex-col desktop:flex-row w-full" key={label}>
        <Link
          className={classnames(
            'mr-0 desktop:mr-normal',
            'whitespace-pre-wrap desktop:whitespace-nowrap',
            'overflow-hidden text-ellipsis',
            'box-border max-w-full',
          )}
          url={getFullLink(slug)}
        >
          {label}
        </Link>
        <span
          className={classnames(
            'ml-0 desktop:ml-auto shrink-0',
            'text-text-muted dark:text-text-muted-dark',
          )}
        >
          {date}
        </span>
      </div>
    );
  };

  const markup = data.map(makePairMarkup);

  return (
    <div className="space-y-small my-large w-full">
      <Header rank={2} type="Heading">
        {title}
      </Header>
      <div className="space-y-small">{markup}</div>
    </div>
  );
};
