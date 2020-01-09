import classnames from 'classnames';
import {Link as GatsbyLink} from 'gatsby';
import {OutboundLink} from 'gatsby-plugin-google-analytics';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {TextStyle} from '../TextStyle';
import * as styles from './Button.module.scss';

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  url?: string;
  onClick?(): void;
}

export const Button = ({className, children, url, onClick}: ButtonProps) => {
  if (url != null && onClick != null) {
    throw new Error('Cannot use both the url and onClick props');
  }

  if (url == null && onClick == null) {
    throw new Error('Must use either the url or onClick prop');
  }

  const buttonText = <TextStyle style="Button">{children}</TextStyle>;
  const theme = useTheme();
  const classname = classnames([
    className,
    styles.Button,
    styles[`Button-${theme}`],
  ]);

  const linkMarkup = (linkUrl?: string) => {
    if (linkUrl == null) {
      throw new Error('Href must not be null');
    }

    const externalUrlPattern = /^http/;
    const isExternalUrl = externalUrlPattern.test(linkUrl);

    return isExternalUrl ? (
      <OutboundLink
        className={classname}
        href={linkUrl}
        target={'_blank'}
        rel="noreferrer"
      >
        {buttonText}
      </OutboundLink>
    ) : (
      <GatsbyLink className={classname} to={linkUrl}>
        {buttonText}
      </GatsbyLink>
    );
  };

  const buttonMarkup = (clickHandler?: () => void) => {
    if (clickHandler == null) {
      throw new Error('You must provide a clickHandler');
    }

    return (
      <button className={classname} onClick={clickHandler}>
        {buttonText}
      </button>
    );
  };

  return url ? linkMarkup(url) : buttonMarkup(onClick);
};
