interface LinkInterface {
  [name: string]: (param?: string) => string;
}

const ExternalLinks: LinkInterface = {
  github: () => 'http://github.com/thetrevorharmon',
  linkedIn: () => 'http://linkedin.com/in/trevorharmon',
  medium: () => 'http://medium.com/@thetrevorharmon',
  mediumPost: (slug: string = '') => `http://medium.com/@thetrevorharmon/${slug}`,
  twitter: () => 'http://twitter.com/thetrevorharmon',
};

const Routes: LinkInterface = {
  about: () => '/about',
  blog: () => '/blog',
  blogPost: (name: string = '') => `/blog/${name}`,
  caseStudies: () => '/case-studies',
  caseStudy: (name: string = '') => `/case-studies/${name}`,
  home: () => '/',
  project: (name: string = '') => `/projects/${name}`,
  projects: () => '/projects',
};

export {
  ExternalLinks,
  Routes,
};
