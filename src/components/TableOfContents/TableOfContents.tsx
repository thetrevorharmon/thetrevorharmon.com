import React from 'react';
import {Link} from '../Link';
import {Routes} from '../../utils';

interface Entry {
  name: string;
  url: string;
  isCurrentEntry: boolean;
}

interface Props {
  header: string;
  entries: Entry[];
  footer: string;
}

export function TableOfContents({header, entries, footer}: Props) {
  return (
    <div className="mt-normal mb-large space-y-normal">
      <p className="italic">{header}</p>
      <div className="my-normal p-normal bg-caption-bg dark:bg-caption-bg-dark">
        <ol>
          {entries.map(({name, url, isCurrentEntry}) => {
            const entryMarkup = isCurrentEntry ? (
              <span className="font-bold">{name}</span>
            ) : (
              <Link url={Routes.blogPost(url)}>{name}</Link>
            );

            return <li key={name}>{entryMarkup}</li>;
          })}
        </ol>
      </div>
      <p className="italic">{footer}</p>
    </div>
  );
}
