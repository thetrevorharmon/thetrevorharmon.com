import classnames from 'classnames';
import {graphql} from 'gatsby';
import React, {useState} from 'react';

import {useTheme} from '../context/ThemeContext';
import {Layout} from '../layouts';
import {Header, Icon, Link, Space, Spacer} from '../UI-Kit';
import {Routes} from '../utils';
import * as styles from './redesign.module.scss';

export default () => {
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
        <Spacer size="tiny">
          <Link href="#" icon={{position: 'leading', name: 'expand'}}>
            This is a link with a leading expand icon
          </Link>
          <Link href="#" icon={{position: 'leading', name: 'link'}}>
            This is a link with a leading link icon
          </Link>
          <Link href="#" icon={{position: 'leading', name: 'rss'}}>
            This is a link with a leading rss icon
          </Link>
          <Link href="#" icon={{position: 'leading', name: 'star'}}>
            This is a link with a leading star icon
          </Link>
          <Link href="#" icon={{position: 'leading', name: 'twitter'}}>
            This is a link with a leading twitter icon
          </Link>
          <Space size="huge" />
          <Link href="#" icon={{position: 'trailing', name: 'expand'}}>
            This is a link with a trailing expand icon
          </Link>
          <Link href="#" icon={{position: 'trailing', name: 'link'}}>
            This is a link with a trailing link icon
          </Link>
          <Link href="#" icon={{position: 'trailing', name: 'rss'}}>
            This is a link with a trailing rss icon
          </Link>
          <Link href="#" icon={{position: 'trailing', name: 'star'}}>
            This is a link with a trailing star icon
          </Link>
          <Link href="#" icon={{position: 'trailing', name: 'twitter'}} isMuted>
            This is a link with a leading twitter icon
          </Link>
          <Space size="huge" />
          <Icon name="expand" size="small" />
          <Icon name="link" size="normal" />
          <Icon name="rss" size="normal" />
          <Icon name="star" size="large" />
          <Icon name="twitter" size="normal" />
        </Spacer>
        <Space size="big" />
      </Spacer>
    </Layout>
  );
};
