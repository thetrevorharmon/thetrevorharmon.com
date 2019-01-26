declare module '*.scss' {
  const content: {[className: string]: string};
  export = content;
}

declare module 'react-masonry-css' {
  import * as React from 'react';

  export interface MasonryProps {
    breakpointCols?: Object;
    columnClassName?: string;
  }

  export default class Masonry extends React.Component<MasonryProps & React.HTMLProps<HTMLElement>, any> {
    render(): JSX.Element;
  }
}

declare module 'gatsby-plugin-google-analytics' {
  import * as React from "react";

  interface OutboundLinkProps {
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  }

  class OutboundLink extends React.Component<OutboundLinkProps & React.HTMLProps<HTMLAnchorElement>, any> {}
  export { OutboundLink };
}

interface PortfolioItem {
  title: string;
  slug: string;
  featureImage: contentfulAsset;
  featureOnHomepage: boolean;
}

interface Project extends PortfolioItem {
  client?: string;
  description: {
    id?: string;
    description: string;
  };
  projectCompletionDate?: Date;
  projectImages: [contentfulAsset]
}

interface CaseStudy extends PortfolioItem {
  tagline: string;
  tableOfContents: contentfulLongText;
  post: contentfulLongText;
}

interface BlogPost {
  title: string;
  slug: string;
  description: {
    description: string;
  }
  originallyPublishedAt: string;
  heroImage: contentfulAsset;
  date: Date;
  body: {
    childMarkdownRemark: {
      html: string;
      excerpt: string;
      timeToRead: string;
    }
  }
  tags: [string];
}

interface AboutPageData {
  title: string;
  post: contentfulLongText;
  featureImage: contentfulAsset;
}

interface contentfulLongText {
  id?: number;
  internal: {
    type?: string;
    mediaType: string;
    content: string;
    contentDigest?: string;
    owner?: string;
  }
  // this is generated by gatsby-transformer-remark
  // it's not a contentful thing
  childMarkdownRemark: {
    html: string;
  }
}

interface contentfulAsset {
  id?: string;
  title: string;
  description: string;
  fluid: {
    aspectRatio: number;
    base64: string;
    sizes: object;
    src: string;
    srcSet: string;
  }
}

interface MediumPost {
  title: string;
  uniqueSlug: string;
  firstPublishedAt: string;
  virtuals: {
    subtitle: string;
    metaDescription: string;
    readingTime: number;
  };
}

interface SiteMetadata {
  title?: string;
  description?: string;
  tagline?: string;
  siteUrl?: string;
}

interface PageMetadata extends SiteMetadata {}
