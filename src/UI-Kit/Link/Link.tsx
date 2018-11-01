import * as React from 'react';
import classnames from 'classnames';
import GastbyLink from 'gatsby-link';

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
  children
}) => {

  const externalPattern = /^http/;
  const externalLink = externalPattern.test(href)

  const classname = classnames(
    className,
    noLinkStyling && styles.Reset,
    !noLinkStyling && styles.Link,
  )

  return externalLink ? (    
    <a className={classname} href={href} target={target}>
      {children}
    </a>
  ) : (
    <GastbyLink className={classname} to={href} target={target}>
      {children}
    </GastbyLink>
  )
}

Link.defaultProps = {
  noLinkStyling: false,
  className: undefined,
  target: undefined,
};

export default Link;
