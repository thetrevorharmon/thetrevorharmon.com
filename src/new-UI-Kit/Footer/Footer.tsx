import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {Link, TextStyle} from '../../new-UI-Kit';
import {ExternalLinks} from '../../utils';
import {useSiteData} from '../../utils/hooks';
import * as styles from './Footer.module.scss';

interface FooterProps {
  className?: string;
}

export const Footer = ({className}: FooterProps) => {
  const {title} = useSiteData();
  const theme = useTheme();
  const classname = classnames(
    className,
    styles.Footer,
    styles[`Footer-${theme}`],
  );

  const footerLinks = [
    {
      display: 'Twitter',
      location: ExternalLinks.twitter(),
    },
    {
      display: 'Github',
      location: ExternalLinks.github(),
    },
    {
      display: 'LinkedIn',
      location: ExternalLinks.linkedIn(),
    },
  ];

  const linkMarkup = (
    <ul className={styles.FooterLinks}>
      {footerLinks.map((link) => (
        <li key={link.display}>
          <Link href={link.location} target="_blank">
            {link.display}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={classname}>
      <TextStyle style="Button">
        &copy; {new Date().getFullYear()} {title}
      </TextStyle>
      {linkMarkup}
    </div>
  );
};
