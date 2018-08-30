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
        <div className="container">
          <div className="row">
            <Link href="/" className={styles.NavbarBrand}>TH</Link>
            <ul className={styles.NavbarLinks}>
              {navbarLinks.map((link) => {
                return <li><Link href={link.location}>{link.display}</Link></li>;
              })}
            </ul>
          </div>

        </div>
      </div>
    </>
  )
}

export default Navbar;
