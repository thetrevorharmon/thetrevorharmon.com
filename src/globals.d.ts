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
}

interface PageMetadata {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

type Mdx = {
  readonly client?: string | null;
  readonly link?: string | null;
  readonly timeToRead?: number | null;
  readonly description?: string | null;
  readonly body?: string | null;
  readonly title?: string | null;
  readonly type?: 'Post' | 'Project' | null;
  readonly status?: 'Archived' | 'Draft' | null;
  readonly slug?: string | null;
  readonly date?: string | null;
  readonly excerpt?: string | null;
  readonly image?: {
    readonly title?: string | null;
    readonly alt?: string | null;
    readonly source?: {
      readonly childImageSharp: {
        readonly gatsbyImageData: import('gatsby-plugin-image').IGatsbyImageData;
      } | null;
    } | null;
    readonly attribution?: {
      readonly author: string | null;
      readonly sourceName: string | null;
      readonly sourceUrl: string | null;
    } | null;
  } | null;
};

interface RecommendedReading {
  link: {
    slug: string;
    label: string;
  };
  date: string;
}
