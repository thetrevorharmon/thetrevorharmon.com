import * as React from "react";
import classnames from 'classnames';

import * as styles from "./Navbar.module.scss"

import { Link } from '../../UI-Kit';

interface NavbarProps {
  handleMenuToggle: (event: React.MouseEvent<HTMLElement>) => void;
  isOpen: boolean;
}

const Navbar: React.SFC<NavbarProps> = ({handleMenuToggle, isOpen}) => {

  const classname = classnames(
    styles.Navbar,
    isOpen && styles.Open
  )

  const navbarLinks = [
    {
      location: '/case-studies',
      display: 'Case Studies'
    },
    {
      location: '/projects',
      display: 'Projects'
    },
    {
      location: '/',
      display: 'About'
    }
  ]

  return (
    <>
      <div className={styles.Offset} />
      <div className={classname}>
        <div className="container d-flex flex-column">
          <div className={styles.TopElementsWrapper}>
            <Link href="/" className={styles.Brand}>TH</Link>

            {/* Normal Links */}
            <ul className={classnames(styles.Links, 'd-none d-sm-flex')}>
              {navbarLinks.map((link, index) => {
                return <li key={index}><Link href={link.location}>{link.display}</Link></li>;
              })}
            </ul>

            {/* Mobile Toggle */}
            <a href="#" className={classnames(styles.Toggle, 'd-inline-block d-sm-none')} onClick={handleMenuToggle}>
              <div className={styles.Bar} />
              <div className={styles.Bar} />            
            </a>
          </div>

          <ul className={styles.MobileLinks}>
            {navbarLinks.map((link, index) => {
              return <li key={index}><Link href={link.location}>{link.display}</Link></li>;
            })}
          </ul>
        </div>
      </div>
    </>
  )
}

export default Navbar;
