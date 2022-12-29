import {graphql} from 'gatsby';
import * as React from 'react';
import Masonry from 'react-masonry-css';

import {FeaturedPostItem, ProjectPreviewTile} from '../components';
import {Layout} from '../layouts';
import {Project} from '../types';
import {Breakout, Header} from '../UI-Kit';
import {Routes} from '../utils';

interface ProjectsPageProps {
  data: {
    allContentfulProject: allContentfulNodes<Project>;
  };
}

export default (props: ProjectsPageProps) => {
  const pageMetadata: PageMetadata = {
    description: `These projects represent some, but not all, of the design and
      development work I've done for the past 5 (or so) years.`,
    title: 'Projects',
    url: Routes.projects(),
  };

  const projectNodes = props.data.allContentfulProject.nodes;
  let featuredProject = null;
  let projects = projectNodes;

  if (projectNodes.length > 1) {
    featuredProject = projectNodes.slice(0, 1)[0];
    projects = projectNodes.slice(1, projectNodes.length - 1);
  }

  const featured =
    featuredProject != null ? (
      <FeaturedPostItem post={featuredProject} />
    ) : null;

  return (
    <Layout pageMetadata={pageMetadata}>
      <div className="space-y-small mt-huge mb-large">
        <div className="space-y-huge">
          <Header rank={1} type="Display">
            Projects
          </Header>
          {featured}
        </div>
        {projects && (
          <Breakout>
            <Masonry
              breakpointCols={{
                default: 2,
                560: 1,
              }}
              className="flex -ml-normal w-auto"
              columnClassName="pl-normal bg-clip-padding [&>div]:mb-normal"
            >
              {projects.map((project, index) => (
                <ProjectPreviewTile project={project} key={index} />
              ))}
            </Masonry>
          </Breakout>
        )}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query projectsPageQuery {
    allContentfulProject(sort: {projectCompletionDate: DESC}) {
      nodes {
        ...ContentfulProject
        slug
      }
    }
  }
`;
