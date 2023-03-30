import {graphql} from 'gatsby';
import React from 'react';
import {PostLayout} from '../layouts';
import {MDXProvider} from '@mdx-js/react';
import {Button, Header, Link, Meta} from '../UI-Kit';
import {FeaturedImage} from './components';
import {Routes, useSiteData} from '../utils';

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
    description: mdx.description ?? undefined,
    image: imageSrc ? `${site.siteUrl}${imageSrc}` : undefined,
    title: mdx.title!,
    url: Routes.blogPost(slug),
  };

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
      pageMetadata={metadata}
      recommendedReading={recommendedReading}
      type="Post"
      hasSignupForm
    >
      <FeaturedImage mdx={mdx} />
      <div className="space-y-tiny">
        <Header rank={1} type="Title">
          {mdx.title}
        </Header>
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
      date(formatString: "DD MMM YYYY")
      image {
        source {
          childImageSharp {
            gatsbyImageData(width: 800)
          }
        }
        alt
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

export default Article;
