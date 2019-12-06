import classnames from 'classnames';
import {graphql} from 'gatsby';
import * as React from 'react';
import Masonry from 'react-masonry-css';

import {useTheme} from '../../context/ThemeContext';
import {Layout} from '../../layouts';
import {Header, Image, Space, Spacer} from '../../new-UI-Kit';
import {Routes} from '../../utils';
import * as styles from './projectTemplate.module.scss';

interface TemplateProps {
  data: {
    allContentfulProject: {
      edges: [
        {
          node: Project;
        },
      ];
    };
  };
  pageContext: {
    slug: string;
  };
}

export default (props: TemplateProps) => {
  const project = props.data.allContentfulProject.edges[0].node;
  const description = project.description.childMarkdownRemark
    ? project.description.childMarkdownRemark.html
    : null;

  const images = project.projectImages
    ? [project.featureImage, ...project.projectImages]
    : [project.featureImage];

  const breakpointColumnsObj = {
    default: 2,
    767: 1,
    // 767 is the medium-sized breakpoint (from bootstrap) minus 1
  };

  const items = images.map((image, index) => {
    return (
      <div key={index}>
        <Image src={image} />
      </div>
    );
  });

  const info = (
    <Spacer size="normal">
      {description && (
        <div
          className={styles.DescriptionHtml}
          dangerouslySetInnerHTML={{__html: description}}
        />
      )}

      <Spacer size="tiny">
        {project.client && (
          <p>
            <strong>Client:</strong> {project.client}
          </p>
        )}

        {project.projectCompletionDate && (
          <p>
            <strong>Project completed:</strong> {project.projectCompletionDate}
          </p>
        )}
      </Spacer>
    </Spacer>
  );

  const infoAndItems = [info, ...items];

  const pageMetadata: PageMetadata = {
    description: `${description}`,
    image: project.featureImage && project.featureImage.fluid.src,
    title: project.title,
    url: Routes.project(props.pageContext.slug),
  };

  const theme = useTheme();

  return (
    <Layout
      className={classnames(
        styles.ProjectTemplate,
        styles[`ProjectTemplate-${theme}`],
      )}
      pageMetadata={pageMetadata}
    >
      <Spacer>
        <Space size="large" />
        <Header rank={1} type="Title">
          {project.title}
        </Header>
        <Space size="medium" />
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={styles.Grid}
          columnClassName={styles.Column}
        >
          {infoAndItems}
        </Masonry>
      </Spacer>
    </Layout>
  );
};

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
            childMarkdownRemark {
              html
            }
          }
          projectImages {
            ...ContentfulAsset_width600
          }
          featureImage {
            ...ContentfulAsset_width600
          }
        }
      }
    }
  }
`;
