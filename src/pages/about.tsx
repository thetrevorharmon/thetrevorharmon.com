import classnames from 'classnames';
import {graphql} from 'gatsby';
import * as React from 'react';

import {useTheme} from '../context/ThemeContext';
import {Layout} from '../layouts';
import {Header, Image} from '../UI-Kit';
import {Routes} from '../utils';
import * as styles from './about.module.scss';

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
  const aboutPage = props.data.allContentfulAboutPage.edges[0].node;

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
      <div className="row mb-5">
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
      </div>
    </Layout>
  );
};

export const query = graphql`
  query AboutPageQuery {
    allContentfulAboutPage {
      edges {
        node {
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
  }
`;
