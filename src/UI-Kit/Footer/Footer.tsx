import * as React from "react";
import classnames from "classnames";
import Link from "../Link";

import * as styles from "./Footer.module.scss"

interface FooterProps {
  className?: string;
}

const Footer: React.SFC<FooterProps> = ({href, className, children}) => {
  const classname = classnames(
    styles.Footer,
    "container",
    className 
  )

  const footerLinks = [
    {
      location: 'http://linkedin.com/in/trevorharmon',
      display: 'LinkedIn'
    },
    {
      location: 'http://github.com/tdharmon',
      display: 'Github'
    },
    {
      location: 'http://twitter.com/thetrevorharmon',
      display: 'Twitter'
    }
  ]

  return (
    <div
      className={classname}
    >
      <div className="row py-5 d-flex align-items-center">
        <div className="col-md-5 order-3 order-md-1">
          &copy; {(new Date()).getFullYear()} The Trevor Harmon
        </div>
        <div className="col-12 col-md-2 order-1 order-md-2">
          <div className={classnames(styles.Brand, "global-brand")}>TH</div>
        </div>
        <div className="col-md-5 order-2 order-md-3 my-2 my-md-0">
          <ul className={styles.FooterLinks}>
            {footerLinks.map((link, index) => (
              <li key={index}><Link href={link.location} target="_blank">{link.display}</Link></li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}

Footer.defaultProps = {
  className: undefined
}

export default Footer;
