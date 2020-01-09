import * as React from 'react';
import {Helmet} from '../utils';

import 'normalize.css';
import '../styles/global.scss';

import {Footer, Navbar} from '../components';
import {Space, Spacer} from '../UI-Kit';
import {Container} from './utils';

interface LayoutProps {
  className?: string;
  hasContainer?: boolean;
  pageMetadata?: PageMetadata;
}

const Layout: React.FC<LayoutProps> = ({
  className,
  hasContainer,
  pageMetadata = {},
  children,
}) => {
  const typicalMarkup = (
    <Container>
      <Spacer>
        <Helmet pageMetadata={pageMetadata} />
        <Navbar />
        <div className={className}>{children}</div>
        <Space size="large" />
        <Footer />
      </Spacer>
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
        <Spacer>
          <Space size="large" />
          <Footer />
        </Spacer>
      </Container>
    </>
  );

  return hasContainer ? typicalMarkup : noChildContainerMarkup;
};

Layout.defaultProps = {
  hasContainer: true,
};

export {Layout};
