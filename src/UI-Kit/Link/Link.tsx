import * as React from "react";
import classnames from 'classnames';
import GastbyLink from "gatsby-link";

import * as styles from "./Link.module.css";

interface LinkProps {
  href: string;
}

const Link: React.SFC<LinkProps> = (props) => {
  const externalPattern = /^http/;
  const externalLink = externalPattern.test(props.href)

  return externalLink ? (    
    <a className={
      classnames(
        styles.Link
      )
    } href={props.href}>
      {props.children}
    </a>
  ) : (
    <GastbyLink className={styles.Link} to={props.href}>
      {props.children}
    </GastbyLink>
  )
}

export default Link;
