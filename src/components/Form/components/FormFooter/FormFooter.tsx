import React from 'react';
import classnames from 'classnames';

import {Link} from '../../../../UI-Kit';
interface FormFooterProps {
  children: React.ReactNode;
  twitter: {
    link: string;
    label: string;
  };
  rss: {
    link: string;
    label: string;
  };
}

export const FormFooter = ({children, twitter, rss}: FormFooterProps) => {
  return (
    <div className="space-y-little">
      <p className="italic">{children}</p>
      <ul
        className={classnames(
          'flex flex-col desktop:flex-row',
          'list-style-none p-0 m-0 w-full',
          'space-y-tiny space-x-0',
          'desktop:space-y-0 desktop:space-x-medium',
        )}
      >
        <li>
          <Link
            url={twitter.link}
            icon={{position: 'leading', name: 'twitter'}}
          >
            {twitter.label}
          </Link>
        </li>
        <li>
          <Link url={rss.link} icon={{position: 'leading', name: 'rss'}}>
            {rss.label}
          </Link>
        </li>
      </ul>
    </div>
  );
};
