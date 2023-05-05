import * as React from 'react';
import {Link} from '../../components';
import {Routes} from '../../utils';

export interface Props {
  recommendedReading: RecommendedReading[];
  type: Mdx['type'];
}

export function ReadingList({type, recommendedReading}: Props) {
  if (recommendedReading.length < 1 || type == null) {
    return null;
  }

  const title = type === 'Post' ? `Want to keep reading?` : 'Want to see more?';
  const description = `If you enjoyed this ${
    type === 'Post' ? 'article' : 'design'
  }, you might enjoy one of these:`;

  const route = type === 'Post' ? Routes.blogPost : Routes.project;

  const makePairMarkup = ({link: {slug, label}, date}: RecommendedReading) => {
    return (
      <div className="" key={label}>
        <Link url={route(slug)}>{label}</Link>
        <div className="text-text-muted dark:text-text-muted-dark">{date}</div>
      </div>
    );
  };

  const markup = recommendedReading.map(makePairMarkup);

  return (
    <div className="space-y-medium w-full">
      <div className="space-y-tiny">
        <h2>{title}</h2>
        <div>
          <p>{description}</p>
        </div>
      </div>
      <div className="space-y-small">{markup}</div>
    </div>
  );
}
