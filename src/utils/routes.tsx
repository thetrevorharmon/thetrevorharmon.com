interface LinkInterface {
  [name: string]: (param?: string) => string;
}

const ExternalLinks: LinkInterface = {
  github: () => 'https://github.com/thetrevorharmon',
  x: () => 'https://x.com/thetrevorharmon',
  mailchimpSignupForm: () =>
    'https://thetrevorharmon.us18.list-manage.com/subscribe?u=564c646304e7c3dcd08710731&id=03c1d4d9de',
};

const Routes: LinkInterface = {
  page: (name: string = '') => `/${name}`,
  about: () => '/about',
  blog: () => '/blog',
  blogPost: (name: string = '') => `/blog/${name}`,
  drafts: () => '/drafts',
  home: () => '/',
};

export {ExternalLinks, Routes};
