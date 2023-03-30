import {graphql} from 'gatsby';
import React from 'react';
import {Layout} from '../layouts';
import {MDXProvider} from '@mdx-js/react';
import {Header, MetaNext} from '../UI-Kit';
import {Routes, useSiteData} from '../utils';

interface Props {
  children: React.ReactNode;
  pageContext: {
    slug: string;
  };
  data: Queries.ProjectNextQuery;
}

function ProjectNext({children, data, pageContext: {slug}}: Props) {
  const site = useSiteData();
  const {mdx} = data;

  if (mdx == null || mdx?.body == null) {
    return null;
  }

  const imageSrc =
    mdx.image?.source?.childImageSharp?.gatsbyImageData.images.fallback?.src;

  const metadata = {
    image: imageSrc ? `${site.siteUrl}${imageSrc}` : undefined,
    title: mdx.title!,
    url: Routes.blogPost(slug),
  };

  return (
    <Layout pageMetadata={metadata}>
      <div className="space-y-large my-large">
        <div className="space-y-tiny">
          <Header rank={1} type="Title">
            {mdx.title}
          </Header>
          <MetaNext date={mdx.date} client={mdx.client} />
        </div>
        <div className="space-y-medium">
          <div className="body-styles projects">
            <MDXProvider>{children}</MDXProvider>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query ProjectNext($slug: String!) {
    mdx(slug: {eq: $slug}) {
      body
      title
      slug
      client
      date(formatString: "DD MMM YYYY")
      image {
        source {
          childImageSharp {
            gatsbyImageData(width: 800)
          }
        }
        alt
      }
    }
  }
`;

export default ProjectNext;
