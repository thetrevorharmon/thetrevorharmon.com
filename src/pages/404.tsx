import classnames from 'classnames';
import * as React from 'react';
import {Layout} from '../layouts';

import {Link} from '../components';
import {Routes, SEO} from '../utils';

function NotFoundPage() {
  return (
    <Layout
      className={classnames(
        'flex flex-col',
        'justify-center',
        'text-center',
        'text-text dark:text-text-dark',
      )}
    >
      <h1 className="page text-[6rem] leading-[10rem] m-0 my-normal">
        <span>404</span>
      </h1>
      <p>Looks like you still haven't found what you're looking for.</p>
      <p className="mb-huge">
        <Link
          url={Routes.home()}
          icon={{name: 'arrowRight', position: 'trailing'}}
        >
          Go Home
        </Link>
      </p>
    </Layout>
  );
}

export default NotFoundPage;

export function Head() {
  return <SEO title="404" />;
}
