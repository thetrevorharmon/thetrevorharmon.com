import * as React from "react";
import classnames from 'classnames';
import GastbyLink from "gatsby-link";

import * as styles from "./Link.module.scss";

interface LinkProps {
  href: string;
  noStyling?: boolean;
}

const Link: React.SFC<LinkProps> = ({href, noStyling, children}) => {
  const externalPattern = /^http/;
  const externalLink = externalPattern.test(href)

  const classname = classnames(
    !noStyling && styles.Link,
    noStyling && styles.Reset
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
  noStyling: false
};

export default Link;
