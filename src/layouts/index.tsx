import * as React from "react"
import 'normalize.css';
import '../styles/global.scss';

const Layout: React.SFC = ({ children }) => (
  <div
    className='container'
  >
    {children}
  </div>
)

export default Layout
