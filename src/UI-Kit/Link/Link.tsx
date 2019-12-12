import classnames from 'classnames';
import {Link as GatsbyLink} from 'gatsby';
import {OutboundLink} from 'gatsby-plugin-google-analytics';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {Icon, IconName} from '../../UI-Kit';
import * as styles from './Link.module.scss';

interface LinkIconProps {
  position: 'leading' | 'trailing';
  name: IconName;
}

interface LinkProps {
  className?: string;
  url: string;
  target?: string;
  isMuted?: boolean;
  icon?: LinkIconProps;
  children: React.ReactNode;
}

export const Link = ({
  url,
  target,
  className,
  isMuted,
  icon,
  children,
}: LinkProps) => {
  const externalUrlPattern = /^http/;
  const isExternalUrl = externalUrlPattern.test(url);

  const theme = useTheme();
  const classname = classnames(
    className,
    styles.Link,
    styles[`Link-${theme}`],
    isMuted && styles.Muted,
  );

  const getInnerMarkup = () => {
    if (icon == null) {
      return children;
    }

    const iconElement = (
      <Icon
        name={icon.name}
        size="normal"
        className={classnames([styles.Icon, styles[`Icon-${icon.position}`]])}
      />
    );

    return icon.position === 'leading' ? (
      <>
        {iconElement}
        {children}
      </>
    ) : (
      <>
        {children}
        {iconElement}
      </>
    );
  };

  const innerMarkup = getInnerMarkup();

  return isExternalUrl ? (
    <OutboundLink
      className={classname}
      href={url}
      target={target || '_blank'}
      rel="noreferrer"
    >
      {innerMarkup}
    </OutboundLink>
  ) : (
    <GatsbyLink className={classname} to={url} target={target || ''}>
      {innerMarkup}
    </GatsbyLink>
  );
};
