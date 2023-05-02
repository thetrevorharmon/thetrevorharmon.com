import {graphql} from 'gatsby';
import React from 'react';
import {PostLayout} from '../layouts';
import {MDXProvider} from '@mdx-js/react';
import {Meta} from '../components';
import {Routes, SEO, useSiteData} from '../utils';
import {getImageSrc} from '../utils/helpers';

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
  data: {mdx},
  pageContext: {recommendedReading},
}: Props) {
  if (mdx == null || mdx?.body == null) {
    return null;
  }

  return (
    <PostLayout type="Project" recommendedReading={recommendedReading}>
      <div className="space-y-tiny">
        <h1>
          <span>{mdx.title}</span>
        </h1>
        <Meta date={mdx.date} client={mdx.client} />
      </div>

      <div className="body-styles projects mt-medium md:mt-large">
        <MDXProvider>{children}</MDXProvider>
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

export function Head({data}: {data: Queries.ProjectQuery}) {
  const {siteUrl} = useSiteData();

  const props = {
    title: data.mdx!.title!,
    url: Routes.project(data.mdx?.slug!),
    image: getImageSrc(data.mdx, siteUrl),
  };

  return <SEO {...props} />;
}

export default ProjectNext;
