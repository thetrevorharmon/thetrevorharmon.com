import classnames from 'classnames';
import { Link as GatsbyLink } from 'gatsby';
import { OutboundLink } from 'gatsby-plugin-google-analytics';
import * as React from 'react';

import * as styles from './Link.module.scss';

interface LinkProps {
  className?: string;
  href: string;
  isIconLink?: boolean;
  noLinkStyling?: boolean;
  target?: string;
}

const Link: React.FC<LinkProps> = ({
  href,
  isIconLink,
  noLinkStyling,
  target,
  className,
  children,
}) => {

  const externalPattern = /^http/;
  const externalLink = externalPattern.test(href);

  const classname = classnames(
    className,
    noLinkStyling && styles.Reset,
    !noLinkStyling && styles.Link,
    isIconLink && styles.IconLink,
  );

  return externalLink ? (
    <OutboundLink className={classname} href={href} target={target || '_blank'} rel="noreferrer">
      {children}
    </OutboundLink>
  ) : (
    <GatsbyLink className={classname} to={href} target={target || ''}>
      {children}
    </GatsbyLink>
  );
};

Link.defaultProps = {
  noLinkStyling: false,
};

export default Link;
