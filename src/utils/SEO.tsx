import React from 'react';
import {useSiteData} from './hooks';

interface Props {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  image?: string | null;
  noIndex?: boolean;
  children?: React.ReactNode;
}

export const SEO = ({
  title: pageTitle,
  description: pageDescription,
  url: pageUrl,
  image: pageImage,
  noIndex = false,
  children,
}: Props) => {
  const {
    title: siteTitle,
    description: siteDescription,
    siteUrl,
    twitterHandle,
  } = useSiteData();

  const title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
  const description = pageDescription ?? siteDescription;
  const image = pageImage ?? `${siteUrl}/favicon.png`;
  const url = pageUrl ? `${siteUrl}${pageUrl}/` : siteUrl;

  return (
    <>
      <title>{title}</title>

      {/* Basic */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Additional */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Specific */}
      <meta
        property="twitter:card"
        content={pageImage ? 'summary_large_image' : 'summary'}
      />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />

      {/* Hide from google */}
      {noIndex && <meta name="robots" content="noindex" />}
      {children}

      <html lang="en" />
    </>
  );
};
