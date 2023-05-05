import * as React from 'react';

import {Footer, Navbar, Container} from '../components';

import 'normalize.css';
import '../styles/global.scss';

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({className, children}) => {
  return (
    <>
      <Container>
        <Navbar />
        <div className={className}>{children}</div>
      </Container>
      <Footer />
    </>
  );
};

export {Layout};
