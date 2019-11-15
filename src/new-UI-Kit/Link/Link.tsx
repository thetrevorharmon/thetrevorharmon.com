import classnames from 'classnames';
import {Link as GatsbyLink} from 'gatsby';
import {OutboundLink} from 'gatsby-plugin-google-analytics';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import * as styles from './Link.module.scss';

interface LinkProps {
  className?: string;
  href: string;
  target?: string;
  isMuted?: boolean;
  children: React.ReactNode;
}

export const Link = ({
  href,
  target,
  className,
  isMuted,
  children,
}: LinkProps) => {
  const externalPattern = /^http/;
  const externalLink = externalPattern.test(href);

  const theme = useTheme();
  const classname = classnames(
    className,
    styles.Link,
    styles[`Link-${theme}`],
    isMuted && styles.Muted,
  );

  return externalLink ? (
    <OutboundLink
      className={classname}
      href={href}
      target={target || '_blank'}
      rel="noreferrer"
    >
      {children}
    </OutboundLink>
  ) : (
    <GatsbyLink className={classname} to={href} target={target || ''}>
      {children}
    </GatsbyLink>
  );
};
