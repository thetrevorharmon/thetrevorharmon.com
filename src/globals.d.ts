interface SiteMetadata {
  title: string;
  description: string;
  siteUrl: string;
  feedUrl: string;
  twitterHandle: string;
}

// Lets plain `tsc` accept `.astro` imports from `.ts` files. `astro check`
// type-checks them for real.
declare module '*.astro' {
  const component: (props: Record<string, unknown>) => unknown;
  export default component;
}
