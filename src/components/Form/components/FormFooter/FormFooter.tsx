import React from 'react';

import {Link, Spacer} from '../../../../new-UI-Kit';
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
            {/* TODO: add twitter & rss icons */}
            <Link href={twitter.link}>{twitter.label}</Link>
          </li>
          <li>
            <Link href={rss.link}>{rss.label}</Link>
          </li>
        </ul>
      </Spacer>
    </div>
  );
};
