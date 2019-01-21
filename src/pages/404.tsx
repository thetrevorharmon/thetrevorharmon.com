import classnames from 'classnames';
import * as React from 'react';
import Layout from '../layouts';

import {
  Header,
  Link,
} from '../UI-Kit';

import {
  Routes,
} from '../utils';

import * as styles from './404.module.scss';

export default () => (
  <Layout className={styles.ErrorPage}>
    <div className="row">
      <div className="col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <Header rank={1} type="Title" className={classnames(styles.Header, 'mt-7 text-center')}>404</Header>
        <p className="mb-7 text-center">Looks like you still haven't found what you're looking for.</p>
        <p className="text-center"><Link href={Routes.home()}>Go Home &rarr;</Link></p>
      </div>
    </div>
  </Layout>
);
