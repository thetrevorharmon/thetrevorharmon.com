import * as React from "react"
import classnames from 'classnames';

import 'normalize.css';
import '../styles/global.scss';

import { Navbar } from "../UI-Kit";

interface LayoutProps {
  container?: boolean;
  className?: string;
}

const Layout: React.SFC<LayoutProps> = ({ container, className, children }) => {
  const classname = classnames(
    container && 'container',
    className
  )

  return (
    <>
      <Navbar />
      <div
        className={classname}
      >
        {children}
      </div>
    </>
  )
}

Layout.defaultProps = {
  container: true,
  className: undefined
}

export default Layout
