import classnames from 'classnames';
import * as React from 'react';
import { Helmet } from '../utils';

import 'normalize.css';
import '../styles/global.scss';

import {
  Footer,
  Navbar,
} from '../UI-Kit';

interface LayoutProps {
  className?: string;
  hasContainer?: boolean;
  pageTitle?: string;
  pageDescription?: string;
}

interface LayoutState {
  isMenuOpen: boolean;
}

class Layout extends React.Component<LayoutProps, LayoutState> {
  public constructor(props: LayoutProps) {
    super(props);
    const initalState: LayoutState = {isMenuOpen: false};

    this.state = initalState;
    this.handleClick = this.handleClick.bind(this);
  }

  public render() {
    const {
      className,
      hasContainer,
      pageTitle,
      pageDescription,
      children,
    } = this.props;

    const classname = classnames(
      hasContainer && 'container',
      className,
    );

    return (
      <>
        <Helmet pageTitle={pageTitle} pageDescription={pageDescription} />
        <Navbar handleMenuToggle={this.handleClick} isOpen={this.state.isMenuOpen} />
        <div
          className={classname}
        >
          {children}
        </div>
        <Footer className="mt-5" />
      </>
    );
  }

  private handleClick() {
    this.setState((prevState: LayoutState) => ({
      isMenuOpen: !prevState.isMenuOpen,
    }));
  }
}

Layout.defaultProps = {
  className: undefined,
  hasContainer: true,
};

export default Layout;
