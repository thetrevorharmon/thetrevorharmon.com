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

export interface OpenGraphMetaTag {
  content: string;
  property: string;
}

const OpenGraphMetaTags = (props: OpenGraphMetaProps) => {

  const ogMapping: OpenGraphMetaProps = {
    basic: {
      image: 'og:image',
      title: 'og:title',
      type: 'og:type',
      url: 'og:url',
    },
    optional: {
      description: 'og:description',
      locale: 'og:locale',
      siteName: 'og:site_name',
    },
    twitter: {
      authorHandle: 'twitter:creator',
      cardType: 'twitter:card',
      description: 'twitter:description',
      image: 'twitter:image',
      siteHandle: 'twitter:site',
    },
  };

  const defaults: OpenGraphMetaTag[] = [
    {
      content: 'summary',
      property: 'twitter:card',
    },
    {
      content: 'website',
      property: 'og:type',
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
