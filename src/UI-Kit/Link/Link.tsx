import * as React from "react";
import classnames from 'classnames';
import GastbyLink from "gatsby-link";

import * as styles from "./Link.module.scss";

interface LinkProps {
  className?: string;
  href: string;
  noLinkStyling?: boolean;
}

const Link: React.SFC<LinkProps> = ({
  href,
  noLinkStyling,
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
    <a className={classname} href={href}>
      {children}
    </a>
  ) : (
    <GastbyLink className={classname} to={href}>
      {children}
    </GastbyLink>
  )
}

Link.defaultProps = {
  noLinkStyling: false,
  className: undefined,
};

export default Link;
