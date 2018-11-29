import classnames from 'classnames';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import * as React from 'react';

import Layout from '../layouts';

import {
  Button,
  Header,
  Link,
  Tile,
} from '../UI-Kit';

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface ProjectsPageProps {
  data: {
    allContentfulProject: {
      edges: [
        {
          node: Project,
        }
      ],
    },
  };
}

export default class ProjectsPage extends React.Component<ProjectsPageProps, {}> {

  public render() {
    const pageTitle = 'Projects';

    console.log(this.props.data.allContentfulProject.edges);

    return (
      <Layout pageTitle={pageTitle}>
        <div className="row">
          <div className="col">
            <Header
              rank={1}
              type="Headline"
              className={classnames(
                'my-6 my-lg-8',
              )}
            >
              Projects
            </Header>
          </div>
        </div>
        <div className="row">
          {this.props.data.allContentfulProject.edges.map((item, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <Tile item={item.node} className="mb-4" />
            </div>
          ))}
        </div>
      </Layout>
    );
  }
}

export const projectsPageQuery = graphql`
  query projectsPageQuery {
    allContentfulProject {
      edges {
        node {
          title
          slug
          featureImage {
            fluid(maxWidth: 600) {
              ...GatsbyContentfulFluid
            }
          }
        }
      }
    }
  }
`;
