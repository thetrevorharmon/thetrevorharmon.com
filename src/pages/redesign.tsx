import classnames from 'classnames';
import {graphql} from 'gatsby';
import React, {useState} from 'react';

import {useTheme} from '../context/ThemeContext';
import {Layout} from '../layouts';
import {Header, Space, Spacer} from '../new-UI-Kit';
import {Routes} from '../utils';
import * as styles from './redesign.module.scss';

interface AboutPageProps {
  data: {
    allContentfulAboutPage: {
      edges: [
        {
          node: AboutPageData;
        },
      ];
    };
  };
}

export default (props: AboutPageProps) => {
  const pageMetadata: PageMetadata = {
    description: 'Redesign',
    title: 'Redesign',
    url: '/redesign',
  };

  return (
    <Layout pageMetadata={pageMetadata}>
      <Spacer size="huge">
        <Space size="huge" />
        <Header rank={1} type="Display">
          Redesign
        </Header>
        <p>Here is a paragraph.</p>
        <Space size="big" />
      </Spacer>
    </Layout>
  );
};
