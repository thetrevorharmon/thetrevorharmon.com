import classnames from 'classnames';
import { graphql } from 'gatsby';
import * as React from 'react';

import Layout from '../layouts';

import {
  Button,
  Header,
  Link,
  Tile,
} from '../UI-Kit';

import { Routes } from '../utils';

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

    const pageMetadata: PageMetadata = {
      description: `These projects represent some, but not all, of the design and
       development work I've done for the past 5 (or so) years.`,
      pageTitle: 'Projects',
      pageUrl: Routes.projects(),
    };

    return (
      <Layout pageMetadata={pageMetadata}>
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
    allContentfulProject(sort: {fields: [projectCompletionDate], order: DESC}) {
      edges {
        node {
          ...ContentfulProjectTile
        }
      }
    }
  }
`;
