import classnames from 'classnames';
import {graphql} from 'gatsby';
import * as React from 'react';

import {Layout} from '../../layouts';
import {Header} from '../../new-UI-Kit';
import {Routes} from '../../utils';
import {ProjectPreviewTile} from './components';

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

  const projectNodes = props.data.allContentfulProject.edges;

  return (
    <Layout pageMetadata={pageMetadata}>
      <div className="row">
        <div className="col">
          <Header
            rank={1}
            type="Display"
            className={classnames('my-6 my-lg-8')}
          >
            Projects
          </Header>
        </div>
      </div>
      <div className="row">
        {projectNodes.map(({node: project}, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <ProjectPreviewTile project={project} className="mb-4" />
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
