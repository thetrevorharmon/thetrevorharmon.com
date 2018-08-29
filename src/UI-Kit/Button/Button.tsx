import * as React from "react";
import Link from "../Link";

import * as styles from "./Button.module.scss"

interface ButtonProps {
  href: string;
}

const Button: React.SFC<ButtonProps> = (props) => {
  return (
    <span className={styles.Button}>
      <Link href={props.href} noStyling={true}>{props.children}</Link>
    </span>
  )
}

export default Button;
