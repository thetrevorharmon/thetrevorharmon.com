import * as React from 'react';

export interface OpenGraphMetaPropsIndexSignature {
  [key: string]: {
    [key: string]: string | undefined;
  } | undefined;
}

export interface OpenGraphMetaProps extends OpenGraphMetaPropsIndexSignature {
  basic: {
    title: string;
    url: string;
    image: string;
    type?: string;
  };
  optional?: {
    description?: string;
    siteName?: string;
    locale?: string;
  };
  twitter?: {
    image?: string;
    description?: string;
    cardType?: string;
    siteHandle?: string;
    authorHandle?: string;
  };
}

export interface OpenGraphMetaConstants {
  description: string;
  image: string;
  locale: string;
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
    description: string;
    image: string;
  };
  type: {
    propertyName: string;
    website: string;
  };
  url: string;
}

export interface OpenGraphMetaTag {
  content: string;
  property: string;
}

const OpenGraphMetaTags = (props: OpenGraphMetaProps) => {
  const og: OpenGraphMetaConstants = {
    description: 'og:description',
    image: 'og:image',
    locale: 'og:locale',
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
      description: 'twitter:description',
      image: 'twitter:image',
    },
    type: {
      propertyName: 'og:type',
      website: 'website',
    },
    url: 'og:url',
  };

  const ogMapping: OpenGraphMetaProps = {
    basic: {
      image: og.image,
      title: og.title,
      type: og.type.propertyName,
      url: og.url,
    },
    optional: {
      description: og.description,
      locale: og.locale,
      siteName: og.siteName,
    },
    twitter: {
      authorHandle: og.twitter.attributions.creator,
      cardType: og.twitter.card.propertyName,
      description: og.twitter.description,
      image: og.twitter.image,
      siteHandle: og.twitter.attributions.site,
    },
  };

  const defaults: OpenGraphMetaTag[] = [
    {
      content: og.twitter.card.type.summary,
      property: og.twitter.card.propertyName,
    },
    {
      content: og.type.website,
      property: og.type.propertyName,
    },
  ];

  const metaTagArray = (metaProps: OpenGraphMetaProps): OpenGraphMetaTag[] => {
    const meta: OpenGraphMetaTag[] = [];

    for (const propGroupName of Object.keys(metaProps)) {
      if (propGroupName) {
        const mappingGroup = ogMapping[propGroupName];
        const propGroup = metaProps[propGroupName];

        if (propGroup && mappingGroup) {
          for (const propName of Object.keys(propGroup)) {

            const property = mappingGroup[propName];
            const content = propGroup[propName];

            if (property && content) {
              meta.push({
                content: `${content}`,
                property: `${property}`,
              });
            }
          }
        }
      }
    }

    return [...defaults, ...meta];
  };

  return metaTagArray(props);
};

export {
  OpenGraphMetaTags,
};
