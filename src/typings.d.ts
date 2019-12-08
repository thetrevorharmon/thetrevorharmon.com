declare module '*.scss' {
  const content: {[className: string]: string};
  export = content;
}

declare module '*.png' {
  const content: any;
  export = content;
}

declare module '*.svg' {
  const content: React.SVGFactory;
  export = content;
}

declare module 'react-masonry-css' {
  import * as React from 'react';

  export interface MasonryProps {
    breakpointCols?: Object;
    columnClassName?: string;
  }

  export default class Masonry extends React.Component<
    MasonryProps & React.HTMLProps<HTMLElement>,
    any
  > {
    render(): JSX.Element;
  }
}

type ContentfulObjectType =
  | 'ContentfulBlogPost'
  | 'ContentfulLinkPost'
  | 'ContentfulProject'
  | 'ContentfulAboutPage';

interface BaseObject {
  internal?: {
    content?: string;
    contentDigest?: string;
    description?: string;
    fieldOwners?: string;
    ignoreType?: string;
    mediaType?: string;
    owner?: string;
    type?: ContentfulObjectType;
  };
}

interface MarkdownRemark {
  html: string;
  excerpt?: string;
  timeToRead?: string;
}

interface ProjectPreview extends BaseObject {
  title: string;
  slug: string;
  featureImage: ContentfulAsset;
  featureOnHomepage: boolean;
  projectCompletionDate?: Date;
}

interface Project extends ProjectPreview {
  client?: string;
  description: {
    id?: string;
    description: string;
    childMarkdownRemark?: MarkdownRemark;
  };
  projectImages: [ContentfulAsset];
}

interface BasicPost extends BaseObject {
  title: string;
  slug: string;
}

interface Post extends BasicPost {
  description?: string;
  date: Date;
  body: {
    childMarkdownRemark: MarkdownRemark;
  };
  tags?: [string];
}

interface BlogPost extends Post {
  heroImage: ContentfulAsset;
  sourceAttribution?: ContentfulAttribution;
  photoAttribution?: ContentfulAttribution;
  postType: 'Blog';
}

interface LinkPost extends Post {
  link: string;
  postType: 'Link';
}

interface AboutPageData extends BaseObject {
  title: string;
  post: contentfulLongText;
  featureImage: ContentfulAsset;
}

interface contentfulLongText {
  id?: number;
  internal: {
    type?: string;
    mediaType: string;
    content: string;
    contentDigest?: string;
    owner?: string;
  };
  // this is generated by gatsby-transformer-remark
  // it's not a contentful thing
  childMarkdownRemark: {
    html: string;
    excerpt?: string;
  };
}

interface ContentfulAsset extends BaseObject {
  id?: string;
  title: string;
  description: string;
  fluid: {
    aspectRatio: number;
    base64: string;
    sizes: object;
    src: string;
    srcSet: string;
  };
}

type ContentfulAttributionType = 'Photo' | 'Article';
type ContentfulAttributionSource = 'Unsplash' | 'Medium';

interface ContentfulAttribution {
  id?: string;
  name: string;
  sourceLocation: string;
  sourceName: ContentfulAttributionSource;
  author: string;
  type: ContentfulAttributionType;
}

interface SiteMetadata {
  title: string;
  description: string;
  tagline: string;
  siteUrl: string;
  feedUrl: string;
  twitter: {
    author: string;
    site: string;
  };
  mailchimpFallbackUrl?: string;
}

interface PageMetadata {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}
