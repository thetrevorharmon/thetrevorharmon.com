import * as React from "react"
import Layout from "../layouts"
import Link from "gatsby-link"

export default () => (
  <Layout>
    <h1>You are here!</h1>
    <h2>But nothing found for you #404</h2>
    <Link to="/">Go Home</Link>
  </Layout>
)
