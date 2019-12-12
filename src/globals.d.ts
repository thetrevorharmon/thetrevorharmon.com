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

interface MarkdownRemark {
  html: string;
  excerpt?: string;
  timeToRead?: string;
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

interface allContentfulEdgesWithNode<T> {
  edges: [
    {
      node: T;
    },
  ];
}
