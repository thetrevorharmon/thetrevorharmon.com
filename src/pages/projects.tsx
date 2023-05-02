import {graphql} from 'gatsby';
import * as React from 'react';
import Masonry from 'react-masonry-css';

import {ProjectTile} from '../components';
import {Layout} from '../layouts';
import {Routes, SEO} from '../utils';

interface ProjectsPageProps {
  data: Queries.ProjectsPageQuery;
}

function ProjectsPage({data}: ProjectsPageProps) {
  return (
    <Layout>
      <div className="space-y-huge mt-huge mb-large">
        <h1 className="featured">
          <span>Projects</span>
        </h1>
        {data.allMdx.nodes && (
          <div className="Breakout">
            <Masonry
              breakpointCols={{
                default: 2,
                560: 1,
              }}
              className="flex -ml-normal w-auto"
              columnClassName="pl-normal bg-clip-padding [&>div]:mb-normal"
            >
              {data.allMdx.nodes.map((project) => (
                <ProjectTile project={project} key={project.slug!} />
              ))}
            </Masonry>
          </div>
        )}
      </div>
    </Layout>
  );
}

export const query = graphql`
  query ProjectsPage {
    allMdx(
      sort: {date: DESC}
      filter: {type: {eq: "Project"}, status: {eq: "Published"}}
    ) {
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

export function Head() {
  return (
    <SEO
      title="Projects"
      description="These projects represent some, but not all, of the design and development work I've done for the past 5 (or so) years."
      url={Routes.projects()}
    />
  );
}

export default ProjectsPage;
