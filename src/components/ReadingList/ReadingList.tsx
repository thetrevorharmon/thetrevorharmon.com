import * as React from 'react';
import {PostTile} from '../../components';

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

  const markup = recommendedReading.map(
    ({slug, label, date, isLinkPost}: RecommendedReading) => (
      <PostTile
        key={slug}
        title={label}
        slug={slug}
        date={date}
        type={type}
        isLinkPost={isLinkPost}
      />
    ),
  );

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
