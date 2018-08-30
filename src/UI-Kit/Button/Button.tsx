import * as React from "react";
import classnames from "classnames";
import Link from "../Link";

import * as styles from "./Button.module.scss"

interface ButtonProps {
  href: string;
  className?: string;
}

const Button: React.SFC<ButtonProps> = ({href, className, children}) => {
  const classname = classnames(
    styles.Button,
    className 
  )

  return (
    <Link
      href={href}
      noLinkStyling={true}
      className={classname}
    >
      {children}
    </Link>
  )
}

Button.defaultProps = {
  className: undefined
}

export default Button;
