import classnames from 'classnames';
import {graphql} from 'gatsby';
import * as React from 'react';

import {Layout} from '../layouts';

import {Button, Header, Link, Tile} from '../UI-Kit';

import {Routes} from '../utils';

interface ProjectsPageProps {
  data: {
    allContentfulProject: {
      edges: [
        {
          node: Project;
        },
      ];
    };
  };
}

export default (props: ProjectsPageProps) => {
  const pageMetadata: PageMetadata = {
    description: `These projects represent some, but not all, of the design and
      development work I've done for the past 5 (or so) years.`,
    title: 'Projects',
    url: Routes.projects(),
  };

  return (
    <Layout pageMetadata={pageMetadata}>
      <div className="row">
        <div className="col">
          <Header
            rank={1}
            type="Headline"
            className={classnames('my-6 my-lg-8')}
          >
            Projects
          </Header>
        </div>
      </div>
      <div className="row">
        {props.data.allContentfulProject.edges.map(({node}, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <Tile item={node} className="mb-4" />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export const query = graphql`
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
