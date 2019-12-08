import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../../../context/ThemeContext';
import {Spacer} from '../../../../UI-Kit';
import './PostBody.scss';
import {PostBodyProps} from './types';

export const PostBody = ({bodyHtml, children}: PostBodyProps) => {
  const theme = useTheme();

  return (
    <Spacer size="medium">
      {bodyHtml && (
        <div className={classnames(['post-body', theme])}>
          <div
            dangerouslySetInnerHTML={{
              __html: bodyHtml,
            }}
          />
        </div>
      )}
      {children}
    </Spacer>
  );
};
