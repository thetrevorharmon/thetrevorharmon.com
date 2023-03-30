import classnames from 'classnames';
import * as React from 'react';
import {Header, Link} from '../../UI-Kit';
import {Routes} from '../../utils';

export interface Props {
  recommendedReading: RecommendedReading[];
  type: Mdx['type'];
}

export function ReadingList({type, recommendedReading}: Props) {
  if (recommendedReading.length < 1 || type == null) {
    return null;
  }

  const title =
    type === 'Post'
      ? `Other things I've written`
      : 'Other things I’ve worked on';
  const route = type === 'Post' ? Routes.blogPost : Routes.project;

  const makePairMarkup = ({link: {slug, label}, date}: RecommendedReading) => {
    return (
      <div className="flex flex-col desktop:flex-row w-full" key={label}>
        <Link
          className={classnames(
            'mr-0 desktop:mr-normal',
            'whitespace-pre-wrap desktop:whitespace-nowrap',
            'overflow-hidden text-ellipsis',
            'box-border max-w-full',
          )}
          url={route(slug)}
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

  const markup = recommendedReading.map(makePairMarkup);

  return (
    <div className="space-y-small my-large w-full">
      <Header rank={2} type="Heading">
        {title}
      </Header>
      <div className="space-y-small">{markup}</div>
    </div>
  );
}
