import * as React from "react";
import classnames from 'classnames';

import * as styles from "./Navbar.module.scss"

import { Link } from '../../UI-Kit';

interface NavbarProps {
}

const Navbar: React.SFC<NavbarProps> = (props) => {

  const classname = classnames(
    styles.Navbar,
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
      <div className={styles.NavbarOffset} />
      <div className={classname}>
        <div className="container d-flex">
          <Link href="/" className={styles.NavbarBrand}>TH</Link>
          <ul className={classnames(styles.NavbarLinks, 'd-none d-sm-flex')}>
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
