import * as React from 'react';

import {Footer, Navbar, Container} from '../components';

import 'normalize.css';
import '../styles/global.scss';

interface Props extends LayoutProps {}

export function PageLayout({className, children}: Props) {
  return (
    <>
      <Container className="space-y-large mb-large">
        <Navbar />
        <div className={className}>{children}</div>
      </Container>
      <Footer />
    </>
  );
}
