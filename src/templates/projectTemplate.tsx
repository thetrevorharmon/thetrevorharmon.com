import { graphql } from 'gatsby';
import * as React from 'react';
// import Masonry from 'react-masonry-component';
import Masonry from 'react-masonry-css';

import Layout from '../layouts';
import { Button, Header } from '../UI-Kit';

import { largestPhotoFromSet } from '../utils';

import * as styles from './projectTemplate.module.scss';

interface TemplateProps {
  data: {
    allContentfulProject: {
      edges: [
        {
          node: Project,
        },
      ],
    },
  };
}

export default class Template extends React.Component<TemplateProps, {}> {
  public render() {
    const project = this.props.data.allContentfulProject.edges[0].node;

    const projectImages: [string] = [largestPhotoFromSet(project.featureImage) || ''];

    const breakpointColumnsObj = {
      default: 2,
      767: 1 // 767 is the medium-sized breakpoint (from bootstrap) minus 1 
    };

    if (project.projectImages) {
      project.projectImages.map((image) => projectImages.push(largestPhotoFromSet(image)));
    }

    const items = projectImages.map((imageSrc, index) => {
      return <div><img key={index} src={imageSrc} /></div>;
    });

    const description = (
      <div className={styles.Description}>
        <Header rank={1} type="Title">{project.title}</Header>
        <p>{project.description ? project.description.description : ''}</p>
        {project.client ? <p><strong>Client:</strong> {project.client}</p> : undefined}
        {
          project.projectCompletionDate
          ? <p><strong>Project completed:</strong> {project.projectCompletionDate}</p>
          : undefined
        }
      </div>
    );

    const finalItems = [description, ...items];

    return (
      <Layout className={styles.ProjectTemplate}>
        <div className="row">
          <div className="col-sm-12">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className={styles.Grid}
              columnClassName={styles.Column}>
                {finalItems}
            </Masonry>          
          </div>
        </div>
      </Layout>
    );
  }
}

export const query = graphql`
  query($slug: String!) {
    allContentfulProject(filter: {slug: {eq: $slug}}) {
      edges {
        node {
          title
          client
          projectCompletionDate(formatString: "MMMM DD, YYYY")
          description {
            description
            id
          }
          projectImages {
            id
            resolutions {
              src
              srcSet
            }
          }
          featureImage {
            id
            resolutions {
              src
              srcSet
            }
          }
        }
      }
    }
  }
`;
