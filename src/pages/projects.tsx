import {graphql} from 'gatsby';
import * as React from 'react';
import Masonry from 'react-masonry-css';

import {FeaturedMdxItem, ProjectTile} from '../components';
import {Layout} from '../layouts';
import {Breakout, Header} from '../UI-Kit';
import {Routes} from '../utils';

interface ProjectsPageProps {
  data: Queries.ProjectsPageQuery;
}

export default ({data}: ProjectsPageProps) => {
  const pageMetadata: PageMetadata = {
    description: `These projects represent some, but not all, of the design and
      development work I've done for the past 5 (or so) years.`,
    title: 'Projects',
    url: Routes.projects(),
  };

  const [featuredProject, ...projects] = data.allMdx.nodes;

  return (
    <Layout pageMetadata={pageMetadata}>
      <div className="space-y-small mt-huge mb-large">
        <div className="space-y-huge">
          <Header rank={1} type="Display">
            Projects
          </Header>
          <FeaturedMdxItem node={featuredProject} />
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
              {projects.map((project) => (
                <ProjectTile project={project} key={project.slug!} />
              ))}
            </Masonry>
          </Breakout>
        )}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query ProjectsPage {
    allMdx(sort: {date: DESC}, filter: {type: {eq: "Project"}}) {
      nodes {
        slug
        title
        client
        type
        date(formatString: "DD MMM YYYY")
        image {
          source {
            childImageSharp {
              gatsbyImageData(width: 800)
            }
          }
          alt
        }
        internal {
          contentFilePath
        }
      }
    }
  }
`;
