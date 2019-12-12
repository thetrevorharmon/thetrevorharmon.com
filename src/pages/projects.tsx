import {graphql} from 'gatsby';
import * as React from 'react';
import Masonry from 'react-masonry-css';

import {ProjectPreviewTile} from '../components';
import {Layout} from '../layouts';
import {Project} from '../types';
import {
  Breakout,
  FeaturedPostItem,
  Header,
  Meta,
  Space,
  Spacer,
} from '../UI-Kit';
import {Routes} from '../utils';
import * as styles from './projects.module.scss';

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
      <>
        <FeaturedPostItem post={featuredProject} />
        <Space size="normal" />
      </>
    ) : null;

  return (
    <Layout pageMetadata={pageMetadata}>
      <Spacer>
        <Space size="huge" />
        <Header rank={1} type="Display">
          Projects
        </Header>
        <Space size="huge" />
        {featured}
        {projects && (
          <Breakout>
            <Masonry
              breakpointCols={{
                default: 2,
                640: 1,
              }}
              className={styles.Grid}
              columnClassName={styles.Column}
            >
              {projects.map((project, index) => (
                <ProjectPreviewTile project={project} key={index} />
              ))}
            </Masonry>
          </Breakout>
        )}
      </Spacer>
    </Layout>
  );
};

export const query = graphql`
  query projectsPageQuery {
    allContentfulProject(sort: {fields: [projectCompletionDate], order: DESC}) {
      nodes {
        title
        slug
        featureOnHomepage
        projectCompletionDate(formatString: "DD MMM YYYY")
        featureImage {
          ...ContentfulAsset_width600
        }
        description {
          description
          childMarkdownRemark {
            excerpt
          }
        }
        internal {
          type
        }
      }
    }
  }
`;
