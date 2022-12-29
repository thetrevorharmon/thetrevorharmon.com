import {graphql} from 'gatsby';
import * as React from 'react';

import {getContentfulAssetSrc, Project} from '../types';
import {Breakout, Image} from '../UI-Kit';
import {Routes} from '../utils';
import {Post} from './Post';
import {LinkDatePair} from './Post/components/PostFooter';

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

  const header = {
    meta: {client: project.client, date: project.projectCompletionDate},
    title: project.title,
  };

  const body = {
    bodyHtml:
      project.description.childMarkdownRemark &&
      project.description.childMarkdownRemark.html,
    children: (
      <div>
        <div className="space-y-medium mt-huge">
          {images.map((image, index) => {
            return (
              <Breakout key={index}>
                <Image
                  className="border border-img-border dark:border-img-border-dark"
                  src={image}
                />
              </Breakout>
            );
          })}
        </div>
      </div>
    ),
  };

  const footer = {
    data: recommendedProjects,
    getFullLink: Routes.project,
    title: 'Other things I’ve worked on',
  };

  return (
    <Post metadata={metadata} header={header} body={body} footer={footer} />
  );
};

export const query = graphql`
  query ProjectPageQuery($slug: String!) {
    contentfulProject(slug: {eq: $slug}) {
      ...ContentfulProject
      client
      projectImages {
        ...ContentfulAsset
      }
      description {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`;
