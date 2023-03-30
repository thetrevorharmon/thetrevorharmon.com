import {graphql} from 'gatsby';
import React from 'react';
import {PostLayout} from '../layouts';
import {MDXProvider} from '@mdx-js/react';
import {Header, Meta} from '../UI-Kit';
import {Routes, useSiteData} from '../utils';

interface Props {
  children: React.ReactNode;
  pageContext: {
    slug: string;
    recommendedReading: RecommendedReading[];
  };
  data: Queries.ProjectQuery;
}

function ProjectNext({
  children,
  data,
  pageContext: {slug, recommendedReading},
}: Props) {
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
    <PostLayout
      pageMetadata={metadata}
      type="Project"
      recommendedReading={recommendedReading}
    >
      <div className="space-y-tiny">
        <Header rank={1} type="Title">
          {mdx.title}
        </Header>
        <Meta date={mdx.date} client={mdx.client} />
      </div>
      <div className="space-y-medium">
        <div className="body-styles projects">
          <MDXProvider>{children}</MDXProvider>
        </div>
      </div>
    </PostLayout>
  );
}

export const query = graphql`
  query Project($slug: String!) {
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
