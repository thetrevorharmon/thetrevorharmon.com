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
  isFormButton?: boolean;
  onClick?(): void;
}

export const Button = ({
  className,
  children,
  href,
  onClick,
  isFormButton = false,
}: ButtonProps) => {
  if (href == null && onClick == null) {
    throw new Error('Must pass either an href or a click handler');
  }

  const buttonText = <TextStyle style="Button">{children}</TextStyle>;
  const theme = useTheme();
  const classname = classnames([
    className,
    styles.Button,
    styles[`Button-${theme}`],
    isFormButton && styles.FormButton,
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
      throw new Error('Href must not be null');
    }

    return (
      <button className={classname} onClick={clickHandler}>
        {buttonText}
      </button>
    );
  };

  return href ? linkMarkup(href) : buttonMarkup(onClick);
};
