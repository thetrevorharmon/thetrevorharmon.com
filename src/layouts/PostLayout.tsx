import * as React from 'react';
import {Helmet} from '../utils';
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
  pageMetadata = {},
  recommendedReading,
  hasSignupForm = false,
  type,
  children,
}: Props) {
  return (
    <>
      <div className="bg-caption-bg  dark:bg-caption-bg-dark">
        <Container>
          <Helmet pageMetadata={pageMetadata} />
          <Navbar />
        </Container>
      </div>
      <div className={classnames('space-y-large', className)}>{children}</div>
      {hasSignupForm && (
        <div className="mt-huge mb-large bg-caption-bg dark:bg-caption-bg-dark">
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
