import { checkHttp } from '../utils';
import * as React from 'react';



interface OpenGraphMetaPropsIndexSignature {
  [key: string]: {
    [key: string]: string | undefined;
  } | undefined
}

interface OpenGraphMetaProps extends OpenGraphMetaPropsIndexSignature {
  page: {
    title: string;
    description: string;
    url: string;
    image?: string;
  };
  site?: {
    image?: string;
    type?: string;
    name?: string;
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

interface OpenGraphConstants {
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

export default class OpenGraphMeta extends React.Component<OpenGraphMetaProps, {}> {
  static og: OpenGraphConstants = {
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

  static mapping: { [key: string]: string } = {
    'page.title': `${OpenGraphMeta.og.title}`,
    'page.description': `${OpenGraphMeta.og.description}`,
    'page.url': `${OpenGraphMeta.og.url}`,
    'page.image': `${OpenGraphMeta.og.image}`,
    'site.image': `${OpenGraphMeta.og.image}`,
    'site.type': `${OpenGraphMeta.og.type.propertyName}`,
    'site.name': `${OpenGraphMeta.og.siteName}`,
    'site.locale': `${OpenGraphMeta.og.locale}`,
    'twitter.image': `${OpenGraphMeta.og.twitter.image}`,
    'twitter.description': `${OpenGraphMeta.og.twitter.description}`,
    'twitter.cardType': `${OpenGraphMeta.og.twitter.card.propertyName}`,
    'twitter.siteHandle': `${OpenGraphMeta.og.twitter.attributions.site}`,
    'twitter.authorHandle': `${OpenGraphMeta.og.twitter.attributions.site}`,
  };

  public static collection = (props: OpenGraphMetaProps) => {
    const {
      site,
      page,
      twitter,
    } = props;

    const og = OpenGraphMeta.og;

    interface Meta {
      content: string;
      property: string;
    }

    let meta: Meta[] = [];

    for (let propGroupName in props) {
      if (propGroupName) {
        let propGroup = props[propGroupName];

        for (let propName in propGroup) {
          let key = `${propGroupName}.${propName}`;
          let content = propGroup[propName]

          content ? meta.push({
            content: content,
            property: OpenGraphMeta.mapping[key]
          }) : undefined;
        }
      }
    }

    let defaults: Meta[] = [
      {
        content: og.twitter.card.type.summary,
        property: og.twitter.card.propertyName,
      },
      {
        content: og.type.website,
        property: og.type.propertyName,
      },
    ]

    let metaWithDefaults = [...defaults, ...meta];

    console.log(metaWithDefaults);


  }
}











const openGraphMetaSimple = (site: SiteMetadata, page: PageMetadata) => {

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

  interface OpenGraphMetaSimple {
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

  const meta: OpenGraphMetaSimple[] = [
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
  openGraphMetaSimple,
  OpenGraphMeta,
};
