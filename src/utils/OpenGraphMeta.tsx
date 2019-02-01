import { checkHttp } from '../utils';
import * as React from 'react';

interface OpenGraphMetaPropsIndexSignature {
  [key: string]: {
    [key: string]: string | undefined;
  } | undefined
}

interface OpenGraphMetaProps extends OpenGraphMetaPropsIndexSignature {
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

interface OpenGraphMetaTag {
  content: string;
  property: string;
}

export default class OpenGraphMeta extends React.Component<OpenGraphMetaProps> {
  private static og: OpenGraphConstants = {
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

  private static mapping: { [key: string]: string } = {
    'basic.title': `${OpenGraphMeta.og.title}`,
    'basic.url': `${OpenGraphMeta.og.url}`,
    'basic.image': `${OpenGraphMeta.og.image}`,
    'basic.type': `${OpenGraphMeta.og.type.propertyName}`,
    'optional.description': `${OpenGraphMeta.og.description}`,
    'optional.siteName': `${OpenGraphMeta.og.siteName}`,
    'optional.locale': `${OpenGraphMeta.og.locale}`,
    'twitter.image': `${OpenGraphMeta.og.twitter.image}`,
    'twitter.description': `${OpenGraphMeta.og.twitter.description}`,
    'twitter.cardType': `${OpenGraphMeta.og.twitter.card.propertyName}`,
    'twitter.siteHandle': `${OpenGraphMeta.og.twitter.attributions.site}`,
    'twitter.authorHandle': `${OpenGraphMeta.og.twitter.attributions.site}`,
  };

  private static defaults: OpenGraphMetaTag[] = [
    {
      content: OpenGraphMeta.og.twitter.card.type.summary,
      property: OpenGraphMeta.og.twitter.card.propertyName,
    },
    {
      content: OpenGraphMeta.og.type.website,
      property: OpenGraphMeta.og.type.propertyName,
    },
  ];

  public metaTagArray = (): OpenGraphMetaTag[] => {
    let meta: OpenGraphMetaTag[] = [];

    for (let propGroupName in this.props) {
      if (propGroupName) {
        let propGroup = this.props[propGroupName];

        for (let propName in propGroup) {
          let key = `${propGroupName}.${propName}`;
          let content = propGroup[propName]

          content && content != "null" ? meta.push({
            content: content,
            property: OpenGraphMeta.mapping[key]
          }) : undefined;
        }
      }
    }

    return [...OpenGraphMeta.defaults, ...meta];
  }

  public render() {
    const metaTags = this.metaTagArray();
    return (
      <>
        {metaTags.map(tag => {
          <meta property={tag.property} content={tag.content} />
        })}
      </>
    )
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
