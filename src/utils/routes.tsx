interface LinkInterface {
  [name: string]: () => string;
}

const ExternalLinks: LinkInterface = {
  github: () => 'http://github.com/tdharmon',
  linkedIn: () => 'http://linkedin.com/in/trevorharmon',
  medium: () => 'http://medium.com/@thetrevorharmon',
  twitter: () => 'http://twitter.com/thetrevorharmon',
};

const Routes: LinkInterface = {
  about: () => '/about',
  caseStudies: () => '/case-studies',
  home: () => '/',
  projects: () => '/projects',
};

export {
  ExternalLinks,
  Routes,
};
