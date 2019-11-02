import classnames from 'classnames';
import {graphql} from 'gatsby';
import * as React from 'react';
import {Layout} from '../layouts';
import * as styles from './redesign.module.scss';
import {Button, Header, Image, Link, Tile} from '../UI-Kit';
import {Routes} from '../utils';
import {Theme} from '../utils/Theme';

interface AboutPageProps {}

export default (props: AboutPageProps) => {
  const pageMetadata: PageMetadata = {
    description: 'Redesigning the site',
    title: 'Redesign',
    url: '/redesign',
  };

  return (
    <Layout className={styles.RedesignPage} pageMetadata={pageMetadata}>
      This is a test
      <Header rank={1} type="Display" theme={Theme.Light}>
        This is a light header
      </Header>
      <Header rank={1} type="Display" theme={Theme.Dark}>
        This is a dark header
      </Header>
      {/* <div className="row mb-5">
        <div className="col-lg-12">
          <Header
            rank={1}
            type="Headline"
            className={classnames('my-6 my-lg-8')}
          >
            {aboutPage.title}
          </Header>
        </div>
        <div className="col-lg-12">
          <Image src={aboutPage.featureImage} className={styles.FeatureImage} />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <div
            dangerouslySetInnerHTML={{
              __html: aboutPage.post.childMarkdownRemark.html,
            }}
          />
        </div>
      </div> */}
    </Layout>
  );
};
