import classnames from 'classnames';
import {Link as GatsbyLink} from 'gatsby';
import {OutboundLink} from 'gatsby-plugin-google-gtag';
import * as React from 'react';

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  url?: string;
  onClick?(): void;
}

export const Button = ({className, children, url, onClick}: ButtonProps) => {
  if (url != null && onClick != null) {
    throw new Error('Cannot use both the url and onClick props');
  }

  if (url == null && onClick == null) {
    throw new Error('Must use either the url or onClick prop');
  }

  const classname = classnames([className, 'Button']);

  const linkMarkup = (linkUrl?: string) => {
    if (linkUrl == null) {
      throw new Error('Href must not be null');
    }

    const externalUrlPattern = /^http/;
    const isExternalUrl = externalUrlPattern.test(linkUrl);

    return isExternalUrl ? (
      <OutboundLink
        className={classname}
        href={linkUrl}
        target={'_blank'}
        rel="noreferrer"
      >
        {children}
      </OutboundLink>
    ) : (
      <GatsbyLink className={classname} to={linkUrl}>
        {children}
      </GatsbyLink>
    );
  };

  const buttonMarkup = (clickHandler?: () => void) => {
    if (clickHandler == null) {
      throw new Error('You must provide a clickHandler');
    }

    return (
      <button className={classname} onClick={clickHandler}>
        {children}
      </button>
    );
  };

  return url ? linkMarkup(url) : buttonMarkup(onClick);
};
