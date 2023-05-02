import {graphql} from 'gatsby';
import React from 'react';
import {PostLayout} from '../layouts';
import {MDXProvider} from '@mdx-js/react';
import {Link, Meta, Button} from '../components';
import {FeaturedImage} from './components';
import {Routes, SEO, useSiteData} from '../utils';
import { getImageSrc } from '../utils/helpers';

interface Props {
  children: React.ReactNode;
  pageContext: {
    slug: string;
    recommendedReading: RecommendedReading[];
  };
  data: Queries.ArticleQuery;
}

function Article({
  children,
  data: {mdx},
  pageContext: {slug, recommendedReading},
}: Props) {
  const site = useSiteData();

  if (mdx == null || mdx?.body == null) {
    return null;
  }

  const twitterUrl = `https://mobile.twitter.com/search?q=${encodeURI(
    [site.siteUrl, Routes.blogPost(slug)].join(''),
  )}&src=typed_query&f=top`;

  const twitterLink = (
    <Link className="block" url={twitterUrl}>
      Reply to this post on Twitter
    </Link>
  );

  const linkPostButton = mdx.link ? (
    <Button url={mdx.link}>View Link</Button>
  ) : null;

  return (
    <PostLayout
      recommendedReading={recommendedReading}
      type="Post"
      hasSignupForm
    >
      <FeaturedImage mdx={mdx} />
      <div className="space-y-tiny mt-large mb-big md:mb-large">
        <h1>
          <span>{mdx.title}</span>
        </h1>
        <Meta
          date={mdx.date}
          timeToRead={mdx.timeToRead}
          isLinkPost={mdx.link != null}
        />
      </div>
      <div className="space-y-medium">
        <div className="body-styles">
          <MDXProvider>{children}</MDXProvider>
        </div>
        {linkPostButton ? linkPostButton : twitterLink}
      </div>
    </PostLayout>
  );
}

export const query = graphql`
  query Article($slug: String!) {
    mdx(slug: {eq: $slug}) {
      body
      title
      slug
      description
      link
      status
      date(formatString: "DD MMM YYYY")
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
      timeToRead
    }
  }
`;


export function Head({data}: {data: Queries.ArticleQuery}) {
  const {siteUrl} = useSiteData();

  const props = {
    title: data.mdx!.title!,
    description: data.mdx?.description ?? undefined,
    url: Routes.blogPost(data.mdx?.slug!),
    image: getImageSrc(data.mdx, siteUrl)
  };

  return <SEO {...props} noIndex={data.mdx?.status !== 'Published'} />;
}

export default Article;
