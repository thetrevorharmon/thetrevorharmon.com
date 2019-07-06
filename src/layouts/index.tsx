import classnames from 'classnames';
import * as React from 'react';
import { Helmet } from '../utils';

import 'normalize.css';
import '../styles/global.scss';

import {
  Footer,
  Navbar,
} from '../UI-Kit';

interface LayoutProps {
  className?: string;
  hasContainer?: boolean;
  pageMetadata?: PageMetadata;
}

const Layout: React.SFC<LayoutProps> = ({
  className,
  hasContainer,
  pageMetadata,
  children,
}) => {

  const classname = classnames(
    hasContainer && 'container',
    className,
  );

  return (
    <>
      <Helmet pageMetadata={pageMetadata || {}} />
      <Navbar />
      <div
        className={classname}
      >
        {children}
      </div>
      <Footer className="mt-5" />
    </>
  );
};

Layout.defaultProps = {
  hasContainer: true,
};

export {
  Layout,
};
