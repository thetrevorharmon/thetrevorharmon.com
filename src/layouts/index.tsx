import * as React from "react"

const MainLayout: React.SFC = ({ children }) => (
  <div
    style={{
      margin: `0 auto`,
      maxWidth: 650,
    }}
  >
    {children}
  </div>
)

export default MainLayout
