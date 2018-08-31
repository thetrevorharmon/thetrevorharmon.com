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
      location: '/',
      display: 'Case Studies'
    },
    {
      location: '/',
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
          <ul className={styles.NavbarLinks}>
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
