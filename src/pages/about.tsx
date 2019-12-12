import classnames from 'classnames';
import {graphql} from 'gatsby';
import * as React from 'react';

import {useTheme} from '../context/ThemeContext';
import {Layout} from '../layouts';
import {
  ContentfulAsset,
  ContentfulBaseObject,
  ContentfulLongText,
} from '../types';
import {Breakout, Header, Image, Space, Spacer} from '../UI-Kit';
import {Routes} from '../utils';
import * as styles from './about.module.scss';

interface AboutPageData extends ContentfulBaseObject {
  title: string;
  post: ContentfulLongText;
  featureImage: ContentfulAsset;
}

interface AboutPageProps {
  data: {
    allContentfulAboutPage: allContentfulNodes<AboutPageData>;
  };
}

export default (props: AboutPageProps) => {
  const aboutPage = props.data.allContentfulAboutPage.nodes[0];

  const pageMetadata: PageMetadata = {
    description: aboutPage.post.childMarkdownRemark.excerpt || '',
    title: 'About',
    url: Routes.about(),
  };

  const theme = useTheme();

  return (
    <Layout
      className={classnames(styles.AboutPage, styles[`AboutPage-${theme}`])}
      pageMetadata={pageMetadata}
    >
      <Spacer>
        <Space size="huge" />
        <Header rank={1} type="Display">
          {aboutPage.title}
        </Header>
        <Space size="huge" />

        <Breakout>
          <Image src={aboutPage.featureImage} className={styles.FeatureImage} />
        </Breakout>

        <Space size="medium" />
        <div
          dangerouslySetInnerHTML={{
            __html: aboutPage.post.childMarkdownRemark.html,
          }}
        />
      </Spacer>
    </Layout>
  );
};

export const query = graphql`
  query AboutPageQuery {
    allContentfulAboutPage {
      nodes {
        title
        featureImage {
          ...ContentfulAsset_width1200
        }
        post {
          childMarkdownRemark {
            html
            excerpt
          }
          internal {
            mediaType
            content
          }
        }
      }
    }
  }
`;
