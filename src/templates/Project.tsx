import {graphql} from 'gatsby';
import * as React from 'react';

import {useTheme} from '../context/ThemeContext';
import {getContentfulAssetSrc, Project} from '../types';
import {Breakout, Image, Space, Spacer} from '../UI-Kit';
import {Routes} from '../utils';
import {Post} from './Post';
import {LinkDatePair} from './Post/components/PostFooter';
import * as styles from './Project.module.scss';

interface TemplateProps {
  data: {
    contentfulProject: Project;
  };
  pageContext: {
    slug: string;
    recommendedProjects: LinkDatePair[];
  };
}

export default (props: TemplateProps) => {
  const project = props.data.contentfulProject;
  const {recommendedProjects} = props.pageContext;
  const description = project.description.childMarkdownRemark
    ? project.description.childMarkdownRemark.html
    : null;

  const images = project.projectImages
    ? [project.featureImage, ...project.projectImages]
    : [project.featureImage];

  const metadata: PageMetadata = {
    description: `${description}`,
    image: getContentfulAssetSrc(project.featureImage),
    title: project.title,
    url: Routes.project(props.pageContext.slug),
  };

  const theme = useTheme();

  const header = {
    meta: {client: project.client, date: project.projectCompletionDate},
    title: project.title,
  };

  const body = {
    bodyHtml:
      project.description.childMarkdownRemark &&
      project.description.childMarkdownRemark.html,
    children: (
      <Spacer>
        <Space size="large" />
        <Spacer size="medium">
          {images.map((image, index) => {
            return (
              <Breakout key={index}>
                <Image className={styles.Image} src={image} />
              </Breakout>
            );
          })}
        </Spacer>
      </Spacer>
    ),
  };

  const footer = {
    data: recommendedProjects,
    getFullLink: Routes.project,
    title: 'Other things I’ve worked on',
  };

  return (
    <Post
      className={styles[`ProjectTemplate-${theme}`]}
      metadata={metadata}
      header={header}
      body={body}
      footer={footer}
    />
  );
};

export const query = graphql`
  query($slug: String!) {
    contentfulProject(slug: {eq: $slug}) {
      ...ContentfulProject
      client
      projectImages {
        ...ContentfulAsset
      }
    }
  }
`;
