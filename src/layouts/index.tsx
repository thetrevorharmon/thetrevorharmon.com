import * as React from "react"
import 'normalize.css';
import '../styles/global.scss';

const Layout: React.SFC = ({ children }) => (
  <div
    style={{
      margin: `0 auto`,
      maxWidth: 650,
    }}
  >
    {children}
  </div>
)

export default Layout
