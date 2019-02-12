import classnames from 'classnames';
import * as React from 'react';
import Link from '../Link';

import * as styles from './Button.module.scss';

interface ButtonProps {
  className?: string;
  href: string;
  noStyling?: boolean;
}

const Button: React.SFC<ButtonProps> = ({
  className,
  children,
  href,
  noStyling,
}) => {

  const classname = classnames(
    className,
    !noStyling && styles.Button,
  );

  return (
    <Link
      href={href}
      noLinkStyling={true}
      className={classname}
    >
      {children}
    </Link>
  );
};

Button.defaultProps = {
  noStyling: false,
};

export default Button;
