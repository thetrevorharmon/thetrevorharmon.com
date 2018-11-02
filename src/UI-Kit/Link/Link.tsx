import classnames from 'classnames';
import { Link as GatsbyLink } from 'gatsby';
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
    <a className={classname} href={href} target={target}>
      {children}
    </a>
  ) : (
    <GastbyLink className={classname} to={href} target={target}>
      {children}
    </GastbyLink>
  );
};

Link.defaultProps = {
  className: undefined,
  noLinkStyling: false,
  target: undefined,
};

export default Link;
