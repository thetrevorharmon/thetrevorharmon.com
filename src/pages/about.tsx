import classnames from 'classnames';
import { graphql } from 'gatsby';
import * as React from 'react';

import { Layout } from '../layouts';

import * as styles from './about.module.scss';

import {
  Button,
  Header,
  Image,
  Link,
  Tile,
} from '../UI-Kit';

import { Routes } from '../utils';

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

    const pageMetadata: PageMetadata = {
      description: `
        First off, introductions. My name is Trevor Harmon and I love to build things.
        I've been designing and developing for about a decade now.
        I've worked on a variety of projects and have done everything from design to full-stack development.
        The thing I enjoy the most (and that people tend to say I'm good at) is front-end development.
        I recently picked up react.js and have been enjoying that.
      `,
      title: 'About',
      url: Routes.about(),
    };

    return (
      <Layout className={styles.AboutPage} pageMetadata={pageMetadata}>
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
  }
}

export const AboutPageQuery = graphql`
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
