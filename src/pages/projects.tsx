import {graphql} from 'gatsby';
import * as React from 'react';

import {ProjectPreviewTile} from '../components';
import {Layout} from '../layouts';
import {Header, Space, Spacer} from '../new-UI-Kit';
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

  const projectNodes = props.data.allContentfulProject.edges;

  return (
    <Layout pageMetadata={pageMetadata}>
      <Spacer>
        <Space size="huge" />
        <Header rank={1} type="Display">
          Projects
        </Header>
        <Space size="huge" />
        <Spacer size="medium">
          {projectNodes.map(({node: project}, index) => (
            <ProjectPreviewTile project={project} key={index} />
          ))}
        </Spacer>
      </Spacer>
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
