import * as React from 'react';

import {
  Footer,
  ReadingList,
  Navbar,
  FollowCallout,
  Container,
} from '../components';

import 'normalize.css';
import '../styles/global.scss';

interface Props extends LayoutProps {
  recommendedReading: RecommendedReading[];
  type: 'Post' | 'Project';
  hasSignupForm?: boolean;
}

export function PostLayout({
  className,
  recommendedReading,
  hasSignupForm = false,
  type,
  children,
}: Props) {
  return (
    <>
      <Container className="space-y-large mb-large">
        <Navbar />
        <div className={className}>{children}</div>
        {hasSignupForm && <FollowCallout />}
        <ReadingList recommendedReading={recommendedReading} type={type} />
      </Container>
      <Footer />
    </>
  );
}
