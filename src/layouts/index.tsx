import * as React from "react"

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
