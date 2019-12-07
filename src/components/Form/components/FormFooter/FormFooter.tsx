import React from 'react';

import {Link, Spacer} from '../../../../UI-Kit';
import * as styles from './FormFooter.module.scss';

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
    <div className={styles.Footer}>
      <Spacer size="tiny">
        <p>{children}</p>
        <ul>
          <li>
            <Link
              href={twitter.link}
              icon={{position: 'leading', name: 'twitter'}}
            >
              {twitter.label}
            </Link>
          </li>
          <li>
            <Link href={rss.link} icon={{position: 'leading', name: 'rss'}}>
              {rss.label}
            </Link>
          </li>
        </ul>
      </Spacer>
    </div>
  );
};
