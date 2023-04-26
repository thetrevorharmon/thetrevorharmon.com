import classnames from 'classnames';
import {Link as GatsbyLink} from 'gatsby';
import {OutboundLink} from 'gatsby-plugin-google-gtag';
import * as React from 'react';

import {Icon, IconName} from '../../components';
import {nbps} from '../../utils';

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

  const classname = classnames(className, isMuted && 'muted');

  const getInnerMarkup = () => {
    if (icon == null) {
      return children;
    }

    const iconElement = (
      <Icon
        name={icon.name}
        size="normal"
        color="primary"
        className={classnames(
          'relative top-[4px]',
          icon.position === 'leading' ? 'mr-little' : 'ml-tiny',
          'inline-block',
        )}
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
        <span className="inline whitespace-nowrap">
          {nbps}
          {iconElement}
        </span>
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