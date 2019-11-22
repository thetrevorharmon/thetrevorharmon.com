import {
  ContentfulAsset,
  ContentfulAttribution,
  ContentfulBaseObject,
  isContentfulElementOfType,
} from './Contentful';

interface Post extends ContentfulBaseObject {
  title: string;
  slug: string;
  description?: string;
  date: Date;
  body: {
    childMarkdownRemark: MarkdownRemark;
  };
  tags?: [string];
}

export interface BlogPost extends Post {
  heroImage?: ContentfulAsset;
  sourceAttribution?: ContentfulAttribution;
  photoAttribution?: ContentfulAttribution;
}

export interface LinkPost extends Post {
  link: string;
}

export function isBlogPost(element: any): element is BlogPost {
  return isContentfulElementOfType(element, 'ContentfulBlogPost');
}

export function isLinkPost(element: any): element is LinkPost {
  return isContentfulElementOfType(element, 'ContentfulLinkPost');
}
