import classnames from 'classnames';
import { Link as GatsbyLink } from 'gatsby';
import { OutboundLink } from 'gatsby-plugin-google-analytics';
import * as React from 'react';

import * as styles from './Link.module.scss';

interface LinkProps {
  className?: string;
  href: string;
  noLinkStyling?: boolean;
  target?: string;
}

const Link: React.SFC<LinkProps> = ({
  href,
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
  className: undefined,
  noLinkStyling: false,
  target: undefined,
};

export default Link;
