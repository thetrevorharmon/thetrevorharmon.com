import classnames from 'classnames';
import * as React from 'react';

import './syntaxHighlighting.scss';
import {PostBodyProps} from './types';

export const PostBody = ({bodyHtml, children}: PostBodyProps) => {
  return (
    <div className="space-y-medium">
      {bodyHtml && (
        <div className={classnames(['body-styles'])}>
          <div
            dangerouslySetInnerHTML={{
              __html: bodyHtml,
            }}
          />
        </div>
      )}
      {children}
    </div>
  );
};
