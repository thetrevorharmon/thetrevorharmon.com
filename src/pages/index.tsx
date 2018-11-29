import classnames from 'classnames';
import { graphql } from 'gatsby';
import * as React from 'react';

import Layout from '../layouts';

import * as styles from './homepage.module.scss';

import {
  ExternalLinks,
  Routes,
} from '../utils/routes';

import {
  Button,
  CaseStudyTile,
  Header,
  Link,
  PostTile,
  Tile,
} from '../UI-Kit';

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        tagline: string,
      },
    },
    allContentfulProject: {
      edges: [
        {
          node: Project,
        }
      ],
    },
    allContentfulCaseStudy: {
      edges: [
        {
           node: CaseStudy,
        }
      ],
    },
    allMediumPost: {
      edges: [
        {
          node: MediumPost,
        }
      ],
    },
  };
}

export default class IndexPage extends React.Component<IndexPageProps, {}> {

  public render() {

    const featuredWork: Array<{node: Project}> = this.props.data.allContentfulProject.edges;
    const featuredStudies: Array<{node: CaseStudy}> = this.props.data.allContentfulCaseStudy.edges;
    const mediumPosts: Array<{node: MediumPost}> = this.props.data.allMediumPost.edges;

    return (
      <Layout>
        <div className="row">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <div
              className={classnames(
                styles.MainHeader,
                'my-6 mt-lg-8 mb-lg-8',
              )}
            >
              <span>Hi, I'm</span>
              <Header
                rank={1}
                type="Headline"
                className={classnames(
                  styles.Name,
                  'my-0',
                )}
              >
                Trevor Harmon.
              </Header>
              <p className="mt-5">
                {this.props.data.site.siteMetadata.tagline}
              </p>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <Header rank={2} type="Subtitle" className="col my-0">Case Studies</Header>
        </div>
        <div className="row">
          {featuredStudies.map((item, index) => (
            <div className="col-sm-12 col-lg-8 mb-4" key={index}>
              <CaseStudyTile item={item.node} />
            </div>
          ))}
          <div className="col-sm-12 col-lg-8">
            <Link href={Routes.caseStudies()} target="_blank">See more case studies &rarr;</Link>
          </div>
        </div>

        <div className="row mt-6 mb-4">
          <Header rank={2} type="Subtitle" className="col">Projects</Header>
        </div>
        <div className="row">
          {featuredWork.map((item, index) => (
            <div className="col-md-6 col-lg-4 mb-4" key={index}>
              <Tile item={item.node} />
            </div>
          ))}
          <div className="col-sm-12">
            <Link href={Routes.projects()} target="_blank">See more projects &rarr;</Link>
          </div>
        </div>

        <div className="row mt-6 mb-4">
          <Header rank={2} type="Subtitle" className="col my-0">Recent Posts</Header>
        </div>
        <div className="row">
          {mediumPosts.map((item, index) => (
            <div className="col-sm-6 col-lg-4 mb-4" key={index}>
              <PostTile item={item.node} />
            </div>
          ))}
          <div className="col-sm-12">
            <Link href={ExternalLinks.medium()} target="_blank">Read more posts on Medium &rarr;</Link>
          </div>
        </div>
      </Layout>
    );
  }
}

export const indexPageQuery = graphql`
  query indexPageQuery {
    site {
      siteMetadata {
        tagline
      }
    }
    allContentfulProject(filter: {featureOnHomepage: {eq: true}}) {
      edges {
        node {
          title
          slug
          featureOnHomepage
          featureImage {
            id
            resolutions {
              src
            }
          }
        }
      }
    }
    allContentfulCaseStudy(filter: {featureOnHomepage: {eq: true}}) {
      edges {
        node {
          title
          slug
          tagline
          featureOnHomepage
          featureImage {
            id
            resolutions {
              src
            }
          }
        }
      }
    }
    allMediumPost(sort: { fields: [firstPublishedAt], order: DESC }, limit: 3) {
      edges {
        node {
          title
          uniqueSlug
          firstPublishedAt(formatString: "MMMM DD, YYYY")
          virtuals {
            readingTime
            subtitle
            metaDescription
          }
        }
      }
    }
  }
`;
