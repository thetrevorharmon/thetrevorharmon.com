interface linkInterface {
  [name: string]: () => string
};

const ExternalLinks: linkInterface = {
  linkedIn: () => 'http://linkedin.com/in/trevorharmon',
  github: () => 'http://github.com/tdharmon',
  twitter: () => 'http://twitter.com/thetrevorharmon'
};

const Routes: linkInterface = {
  home: () => '/',
};

export {
  ExternalLinks,
  Routes,
}
