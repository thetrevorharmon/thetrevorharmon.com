import * as React from "react";
import classnames from "classnames";
import Link from "../Link";

import * as styles from "./Button.module.scss"

interface ButtonProps {
  href: string;
  className?: string;
  noStyling?: boolean;
}

const Button: React.SFC<ButtonProps> = ({href, className, noStyling, children}) => {
  const classname = classnames(
    !noStyling && styles.Button,
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
  className: undefined,
  noStyling: false,
}

export default Button;
