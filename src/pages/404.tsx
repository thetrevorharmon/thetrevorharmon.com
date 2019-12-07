import classnames from 'classnames';
import * as React from 'react';
import {Layout} from '../layouts';

import {useTheme} from '../context/ThemeContext';
import {Header, Link} from '../UI-Kit';
import {Routes} from '../utils';
import * as styles from './404.module.scss';

export default () => {
  const theme = useTheme();
  return (
    <Layout
      className={classnames(styles.ErrorPage, styles[`ErrorPage-${theme}`])}
    >
      <Header rank={1} type="Display" className={styles.Header}>
        404
      </Header>
      <p>Looks like you still haven't found what you're looking for.</p>
      <p>
        <Link href={Routes.home()}>Go Home &rarr;</Link>
      </p>
    </Layout>
  );
};
