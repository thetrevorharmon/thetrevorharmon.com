import * as React from "react"
import classnames from 'classnames';

import 'normalize.css';
import '../styles/global.scss';

import { Navbar } from "../UI-Kit";

interface LayoutProps {
  hasContainer?: boolean;
  className?: string;
}

class Layout extends React.Component<LayoutProps, {}> {
  constructor(props) {
    super(props);
    this.state = {isMenuOpen: false};

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isMenuOpen: !prevState.isMenuOpen
    }));
  }

  render() {
    const {
      hasContainer,
      className,
      children
    } = this.props

    const classname = classnames(
      hasContainer && 'container',
      className
    )

    return (
      <>
        <Navbar handleMenuToggle={this.handleClick} isOpen={this.state.isMenuOpen} />
        <div
          className={classname}
        >
          {children}
        </div>
      </>
    )
  }
}

Layout.defaultProps = {
  hasContainer: true,
  className: undefined
}

export default Layout
