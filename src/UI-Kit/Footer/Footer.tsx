import classnames from 'classnames';
import * as React from 'react';

import * as styles from './Footer.module.scss';
import {useTheme} from '../../context/ThemeContext';
import {Link} from '../../UI-Kit';
import {ExternalLinks, Routes} from '../../utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({className, children}) => {
  const theme = useTheme();
  const classname = classnames(
    className,
    'container',
    styles.Footer,
    styles[`Footer-${theme}`],
  );

  const footerLinks = [
    {
      display: 'LinkedIn',
      location: ExternalLinks.linkedIn(),
    },
    {
      display: 'Github',
      location: ExternalLinks.github(),
    },
    {
      display: 'Twitter',
      location: ExternalLinks.twitter(),
    },
  ];

  return (
    <div className={classname}>
      <div className="row py-5 d-flex align-items-center">
        <div className="col-md-5 order-3 order-md-1">
          &copy; {new Date().getFullYear()} The Trevor Harmon
        </div>
        <div className="col-12 col-md-2 order-1 order-md-2">
          <Link
            href={Routes.home()}
            className={classnames(styles.Brand, 'global-brand')}
          >
            TH
          </Link>
        </div>
        <div className="col-md-5 order-2 order-md-3 my-2 my-md-0">
          <ul className={styles.FooterLinks}>
            {footerLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.location} target="_blank">
                  {link.display}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

Footer.defaultProps = {};

export default Footer;
