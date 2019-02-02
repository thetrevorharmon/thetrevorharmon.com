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

  const mapping: { [key: string]: string } = {
    'basic.image': `${og.image}`,
    'basic.title': `${og.title}`,
    'basic.type': `${og.type.propertyName}`,
    'basic.url': `${og.url}`,

    'optional.description': `${og.description}`,
    'optional.locale': `${og.locale}`,
    'optional.siteName': `${og.siteName}`,

    'twitter.authorHandle': `${og.twitter.attributions.site}`,
    'twitter.cardType': `${og.twitter.card.propertyName}`,
    'twitter.description': `${og.twitter.description}`,
    'twitter.image': `${og.twitter.image}`,
    'twitter.siteHandle': `${og.twitter.attributions.site}`,
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
        const propGroup = metaProps[propGroupName];

        if (propGroup) {
          for (const propName of Object.keys(propGroup)) {
            const key = `${propGroupName}.${propName}`;
            const content = propGroup[propName];

            if (content && content !== 'null' && mapping[key]) {
              meta.push({
                content: `${content}`,
                property: mapping[key],
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
