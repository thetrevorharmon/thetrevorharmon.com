import * as React from 'react';
import {Helmet} from '../utils';

import 'normalize.css';
import '../styles/global.scss';

import {Footer, Navbar} from '../components';
import {Container} from './utils';

interface LayoutProps {
  className?: string;
  hasContainer?: boolean;
  pageMetadata?: PageMetadata;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  className,
  hasContainer,
  pageMetadata = {},
  children,
}) => {
  const typicalMarkup = (
    <Container>
      <Helmet pageMetadata={pageMetadata} />
      <Navbar />
      <div className={className}>{children}</div>
      <Footer />
    </Container>
  );

  const noChildContainerMarkup = (
    <>
      <Container>
        <Helmet pageMetadata={pageMetadata} />
        <Navbar />
      </Container>
      <div className={className}>{children}</div>
      <Container>
        <Footer />
      </Container>
    </>
  );

  return hasContainer ? typicalMarkup : noChildContainerMarkup;
};

Layout.defaultProps = {
  hasContainer: true,
};

export {Layout};
