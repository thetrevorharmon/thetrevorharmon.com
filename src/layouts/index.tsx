import * as React from "react"
import 'normalize.css';
import '../styles/global.scss';

import { Navbar } from "../UI-Kit";

const Layout: React.SFC = ({ children }) => (
  <>
    <Navbar />
    <div
      className='container'
    >
      {children}
    </div>
  </>
)

export default Layout
