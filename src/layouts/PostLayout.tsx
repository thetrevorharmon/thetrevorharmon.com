import * as React from 'react';
import classnames from 'classnames';

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
      <Container>
        <Navbar />
        <div className={classnames('my-large', className)}>{children}</div>
      </Container>
      {hasSignupForm && (
        <div className="mt-large mb-big bg-caption-bg dark:bg-caption-bg-dark">
          <Container>
            <FollowCallout />
          </Container>
        </div>
      )}
      <Container>
        <ReadingList recommendedReading={recommendedReading} type={type} />
        <Footer />
      </Container>
    </>
  );
}
