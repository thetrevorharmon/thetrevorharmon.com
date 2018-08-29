import * as React from "react";
import Link from "../Link";

import * as styles from "./Button.module.scss"

interface ButtonProps {
  href: string;
}

const Button: React.SFC<ButtonProps> = (props) => {
  return (
    <Link
      href={props.href}
      noLinkStyling={true}
      className={styles.Button}
    >
      {props.children}
    </Link>
  )
}

export default Button;
