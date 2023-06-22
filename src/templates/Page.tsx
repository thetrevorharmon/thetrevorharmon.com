import {graphql} from 'gatsby';
import React from 'react';
import {PageLayout} from '../layouts';
import {MdxProvider} from '../components';
import {FeaturedImage} from './components';
import {Routes, SEO, useSiteData} from '../utils';
import {getImageSrc} from '../utils/helpers';

interface Props {
  children: React.ReactNode;
  pageContext: {
    slug: string;
  };
  data: Queries.PageQuery;
}

function Page({children, data: {mdx}, pageContext: {slug}}: Props) {
  if (mdx == null || mdx?.body == null) {
    return null;
  }

  return (
    <PageLayout>
      <div className="space-y-large my-huge">
        <div className="space-y-huge">
          <h1 className="featured">
            {mdx.title}
          </h1>
        <FeaturedImage mdx={mdx} />
        </div>
      <div className="body-styles">
        <MdxProvider>{children}</MdxProvider>
      </div>
      </div>
    </PageLayout>
  );
}

export const query = graphql`
  query Page($slug: String!) {
    mdx(slug: {eq: $slug}) {
      body
      title
      slug
      description
      image {
        source {
          childImageSharp {
            gatsbyImageData(width: 800)
          }
        }
        alt
        title
        attribution {
          author
          sourceName
          sourceUrl
        }
      }
    }
  }
`;

export function Head({data}: {data: Queries.PageQuery}) {
  const {siteUrl} = useSiteData();

  const props = {
    title: data.mdx!.title!,
    description: data.mdx?.description ?? undefined,
    url: Routes.page(data.mdx?.slug!),
    image: getImageSrc(data.mdx, siteUrl),
  };

  return <SEO {...props} />;
}

export default Page;
