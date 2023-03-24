import * as React from 'react';
import {Helmet as ReactHelmet} from 'react-helmet';

import {useTheme} from '../context/ThemeContext';
import {Helpers, MetaTags, useSiteData} from '../utils';

interface HelmetProps {
  pageMetadata: PageMetadata;
}

const Helmet: React.FC<HelmetProps> = ({pageMetadata}) => {
  const page = pageMetadata;
  const site = useSiteData();

  const title = page.title ? `${page.title} | ${site.title}` : site.title;

  const extraMeta = [
    {
      content: page.description || site.description,
      name: 'Description',
    },
  ];

  const meta = MetaTags(
    {
      basic: {
        image: page.image
          ? Helpers.checkHttp(page.image)
          : `${site.siteUrl}/favicon.png`,
        title: page.title || site.title,
        url: page.url ? `${site.siteUrl}${page.url}/` : site.siteUrl,
      },
      optional: {
        description: page.description || site.description,
        siteName: site.title,
      },
      twitter: {
        authorHandle: site.twitter.author,
        cardType: page.image && 'summary_large_image',
        siteHandle: site.twitter.site,
      },
    },
    extraMeta,
  );

  const theme = useTheme();

  return (
    <ReactHelmet title={title} meta={meta}>
      <html lang="en" />
      <body className={theme.toLowerCase()} />
    </ReactHelmet>
  );
};

Helmet.defaultProps = {
  pageMetadata: {},
};

export {Helmet};
