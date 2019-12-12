import classnames from 'classnames';
import {graphql} from 'gatsby';
import * as React from 'react';

import {useTheme} from '../context/ThemeContext';
import {getContentfulAssetSrc, Project} from '../types';
import {Breakout, Image, Space, Spacer} from '../UI-Kit';
import {Routes} from '../utils';
import {Post} from './Post';
import * as styles from './Project.module.scss';

interface TemplateProps {
  data: {
    allContentfulProject: allContentfulEdgesWithNode<Project>;
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
    // TODO: get other things you've worked on actual data
    data: [
      {
        date: new Date(Date.parse('11/02/2019')), // TODO: put actual date here
        link: {
          href: Routes.project('sweet-honey-cover-art'),
          label: '"Sweet Honey" Cover Art',
        },
      },
    ],
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
    allContentfulProject(filter: {slug: {eq: $slug}}) {
      edges {
        node {
          internal {
            type
          }
          title
          client
          projectCompletionDate(formatString: "DD MMM YYYY")
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
