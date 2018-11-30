import classnames from 'classnames';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import * as React from 'react';

import Layout from '../layouts';

import * as styles from './about.module.scss';

import {
  Button,
  Header,
  Link,
  Tile,
} from '../UI-Kit';
import { largestPhotoFromSet } from '../utils';

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface AboutPageProps {
  data: {
    allContentfulAboutPage: {
      edges: [
        {
          node: AboutPageData,
        }
      ],
    },
  };
}

export default class AboutPage extends React.Component<AboutPageProps, {}> {

  public render() {
    const aboutPage = this.props.data.allContentfulAboutPage.edges[0].node;
    const pageTitle = 'About';

    return (
      <Layout className={styles.AboutPage} pageTitle={pageTitle}>
        <div className="row mb-5">
          <div className="col-lg-12">
            <Header
              rank={1}
              type="Headline"
              className={classnames(
                'my-6 my-lg-8',
              )}
            >
              {aboutPage.title}
            </Header>
          </div>
          <div className="col-lg-12">
            <Img fluid={aboutPage.featureImage.fluid} className={styles.FeatureImage} />
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
  }
}

export const AboutPageQuery = graphql`
  query AboutPageQuery {
    allContentfulAboutPage {
      edges {
        node {
          title
          featureImage {
            resolutions {
              src
              srcSet
            }
            fluid(maxWidth: 1200) {
              ...GatsbyContentfulFluid
            }
          }
          post {
            childMarkdownRemark {
              html
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
