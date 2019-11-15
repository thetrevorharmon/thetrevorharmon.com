import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import Link from '../Link';
import * as styles from './Button.module.scss';

interface ButtonProps {
  className?: string;
  href: string;
  noStyling?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  children,
  href,
  noStyling,
}) => {
  const theme = useTheme();
  const classname = classnames(
    className,
    !noStyling && styles.Button,
    styles[`Button-${theme}`],
  );

  return (
    <Link href={href} noLinkStyling={true} className={classname}>
      {children}
    </Link>
  );
};

Button.defaultProps = {
  noStyling: false,
};

export default Button;
