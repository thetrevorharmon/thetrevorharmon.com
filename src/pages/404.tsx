import classnames from 'classnames';
import * as React from 'react';
import {Layout} from '../layouts';

import {Header, Link} from '../UI-Kit';
import {Routes} from '../utils';

export default () => {
  return (
    <Layout
      className={classnames(
        'flex flex-col',
        'justify-center',
        'text-center',
        'text-text dark:text-text-dark',
      )}
    >
      <Header
        rank={1}
        type="Display"
        className="text-[6rem] desktop:text-[6rem] leading-[10rem] m-0"
      >
        404
      </Header>
      <p>Looks like you still haven't found what you're looking for.</p>
      <p className="mb-huge">
        <Link url={Routes.home()}>Go Home &rarr;</Link>
      </p>
    </Layout>
  );
};
