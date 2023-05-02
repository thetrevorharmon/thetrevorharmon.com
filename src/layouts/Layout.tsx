import * as React from 'react';

import {Footer, Navbar, Container} from '../components';

import 'normalize.css';
import '../styles/global.scss';

interface LayoutProps {
  className?: string;
  hasContainer?: boolean;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({className, hasContainer, children}) => {
  const typicalMarkup = (
    <Container>
      <Navbar />
      <div className={className}>{children}</div>
      <Footer />
    </Container>
  );

  const noChildContainerMarkup = (
    <>
      <Container>
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
