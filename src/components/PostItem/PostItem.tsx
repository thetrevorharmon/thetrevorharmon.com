import * as React from 'react';

import {BlogPost, isLinkPost, isProject, LinkPost, Project} from '../../types';
import {Header, Link, Meta, MetaProps, TextStyle} from '../../UI-Kit';
import {Routes} from '../../utils';

export interface PostItemProps {
  post: BlogPost | LinkPost | Project;
  className?: string;
}

interface PostItemAttributes {
  title: string;
  meta: MetaProps;
  url: string;
  description: string;
}

const getProjectItemAttributes = (project: Project): PostItemAttributes => {
  return {
    description:
      project.description.childMarkdownRemark &&
      project.description.childMarkdownRemark.excerpt
        ? project.description.childMarkdownRemark.excerpt
        : project.description.description,
    meta: {client: project.client, date: project.projectCompletionDate},
    title: project.title,
    url: Routes.project(project.slug),
  };
};

const getPostItemAttributes = (
  post: BlogPost | LinkPost,
): PostItemAttributes => {
  return {
    description:
      post.description || post.body.childMarkdownRemark.excerpt || '',
    meta: {
      date: post.date,
      isLinkPost: isLinkPost(post),
      timeToRead: post.body.childMarkdownRemark.timeToRead,
    },
    title: post.title,
    url: Routes.blogPost(post.slug),
  };
};

export const PostItem = ({post, className}: PostItemProps) => {
  const attributes = isProject(post)
    ? getProjectItemAttributes(post)
    : getPostItemAttributes(post);

  const {title, meta, url, description} = attributes;

  return (
    <div className={className}>
      <div className="space-y-normal">
        <div className="space-y-small">
          <div className="space-y-tiny">
            <Header rank={2} type="Heading">
              {title}
            </Header>
            <Meta {...meta} />
          </div>
          <p>
            <TextStyle style="Body">{description}</TextStyle>
          </p>
        </div>

        <Link url={url} className="block">
          Continue Reading →
        </Link>
      </div>
    </div>
  );
};
