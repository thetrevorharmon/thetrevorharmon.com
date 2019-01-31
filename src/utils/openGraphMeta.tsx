import { checkHttp } from '../utils';
const openGraphMeta = (site: SiteMetadata, page: PageMetadata) => {

  interface OpenGraphConstants {
    description: string;
    image: string;
    siteName: string;
    title: string;
    twitter: {
      attributions: {
        creator: string;
        site: string;
      },
      card: {
        propertyName: string;
        type: {
          largeImage: string;
          summary: string;
        },
      },
    };
    type: {
      propertyName: string;
      website: string;
    };
    url: string;
  }

  interface OpenGraphMeta {
    content: string;
    property?: string;
    name?: string;
  }

  // og means openGraph, to save space
  const og: OpenGraphConstants = {
    description: 'og:description',
    image: 'og:image',
    siteName: 'og:site_name',
    title: 'og:title',
    twitter: {
      attributions: {
        creator: 'twitter:creator',
        site: 'twitter:site',
      },
      card: {
        propertyName: 'twitter:card',
        type: {
          largeImage: 'summary_large_image',
          summary: 'summary',
        },
      },
    },
    type: {
      propertyName: 'og:type',
      website: 'website',
    },
    url: 'og:url',
  };

  const meta: OpenGraphMeta[] = [
    {
      content: page.title || site.title,
      property: og.title,
    },
    {
      content: page.description || site.description,
      property: og.description,
    },
    {
      content: page.url ? `${site.siteUrl}${page.url}/` : site.siteUrl,
      property: og.url,
    },
    {
      content: page.image ? checkHttp(page.image) : `${site.siteUrl}/favicon.png`,
      property: og.image,
    },
    {
      content: page.image ? og.twitter.card.type.largeImage : og.twitter.card.type.summary,
      property: og.twitter.card.propertyName,
    },
    {
      content: og.type.website,
      property: og.type.propertyName,
    },
    {
      content: site.title,
      property: og.siteName,
    },
    {
      content: site.twitter.site,
      name: og.twitter.attributions.site,
    },
    {
      content: site.twitter.author,
      name: og.twitter.attributions.creator,
    },
  ];

  return meta;
};

export {
  openGraphMeta,
};
