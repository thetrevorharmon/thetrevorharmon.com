import * as React from 'react';

export interface MetaPropsIndexSignature {
  [key: string]: {
    [key: string]: string | undefined;
  } | undefined;
}

export interface MetaProps extends MetaPropsIndexSignature {
  basic?: {
    title?: string;
    url?: string;
    image?: string;
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

export interface MetaTag {
  content: string;
  property?: string;
  name?: string;
}

const MetaTags = (props: MetaProps, userMeta?: MetaTag[]): MetaTag[] => {

  const ogMapping: MetaProps = {
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

  const defaults: MetaTag[] = [
    {
      content: 'summary',
      property: 'twitter:card',
    },
    {
      content: 'website',
      property: 'og:type',
    },
  ];

  const makeTagArray = (metaProps: MetaProps, userTags: MetaTag[]): MetaTag[] => {
    const meta: MetaTag[] = [];

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

    return [
      ...defaults,
      ...meta,
      ...userTags,
    ];
  };

  return makeTagArray(props, userMeta || []);
};

export {
  MetaTags,
};
