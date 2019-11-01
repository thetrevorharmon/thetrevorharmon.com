import classnames from 'classnames';
import React, {useState} from 'react';
import * as styles from './Navbar.module.scss';

import {Button, Link} from '../../UI-Kit';

import {Routes} from '../../utils';

const Navbar: React.FC<{}> = () => {
  const [isOpen, setOpen] = useState(false);

  const classname = classnames(styles.Navbar, isOpen && styles.Open);

  const navbarLinks = [
    {
      display: 'Blog',
      location: Routes.blog(),
    },
    {
      display: 'Projects',
      location: Routes.projects(),
    },
    {
      display: 'Case Studies',
      location: Routes.caseStudies(),
    },
    {
      display: 'About',
      location: Routes.about(),
    },
  ];

  const handleMenuToggle = () => setOpen(!isOpen);

  return (
    <>
      <div className={styles.Offset} />
      <div className={classname}>
        <div className="container d-flex flex-column">
          <div className={styles.TopElementsWrapper}>
            <Button
              href={Routes.home()}
              className={classnames(styles.Brand, 'global-brand')}
              noStyling={true}
            >
              TH
            </Button>

            {/* Normal Links */}
            <ul className={classnames(styles.Links, 'd-none d-sm-flex')}>
              {navbarLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.location}>{link.display}</Link>
                </li>
              ))}
            </ul>

            {/* Mobile Toggle */}
            <a
              className={classnames(styles.Toggle, 'd-inline-block d-sm-none')}
              onClick={handleMenuToggle}
            >
              <div className={styles.Bar} />
              <div className={styles.Bar} />
            </a>
          </div>

          <ul className={styles.MobileLinks}>
            {navbarLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.location}>{link.display}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
