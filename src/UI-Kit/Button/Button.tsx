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
  href?: string;
  onClick?(): void;
}

export const Button = ({className, children, href, onClick}: ButtonProps) => {
  if (href != null && onClick != null) {
    throw new Error('Cannot use both the href and onClick props');
  }

  if (href == null && onClick == null) {
    throw new Error('Must use either the href or onClick prop');
  }

  const buttonText = <TextStyle style="Button">{children}</TextStyle>;
  const theme = useTheme();
  const classname = classnames([
    className,
    styles.Button,
    styles[`Button-${theme}`],
  ]);

  const linkMarkup = (linkHref?: string) => {
    if (linkHref == null) {
      throw new Error('Href must not be null');
    }

    const externalPattern = /^http/;
    const externalLink = externalPattern.test(linkHref);

    return externalLink ? (
      <OutboundLink
        className={classname}
        href={linkHref}
        target={'_blank'}
        rel="noreferrer"
      >
        {buttonText}
      </OutboundLink>
    ) : (
      <GatsbyLink className={classname} to={linkHref}>
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

  return href ? linkMarkup(href) : buttonMarkup(onClick);
};
