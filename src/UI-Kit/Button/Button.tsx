import * as React from "react";
import Link from "gatsby-link"

import * as styles from "./Button.module.scss"

interface ButtonProps {
  href: string;
}

const Button: React.SFC<ButtonProps> = (props) => {
  return (
    <div className={styles.Button}>
      <Link to={props.href}>{props.children}</Link>
    </div>
  )
}

export default Button;
