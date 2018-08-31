import { graphql } from "gatsby"
import * as React from "react"

import Layout from "../layouts"
import { Button, Header } from "../UI-Kit";

import { largestPhotoFromSet } from "../utils";

import * as styles from "./projectTemplate.module.scss";

interface TemplateProps {
  data: {
    allContentfulProject: {
      edges: [
        {
          node: Project
        }
      ]
    }
  }
}

export default class Template extends React.Component<TemplateProps, {}> {
  render() {
    const project = this.props.data.allContentfulProject.edges[0].node

    const photos: [string] = []

    project.photos.map((photo) => {
      photos.push(largestPhotoFromSet(photo));
    })

    console.log(photos)

    return (
      <Layout className={styles.ProjectTemplate}>
        <div className="row">
          <div className="col-sm-6">
            {photos.map((photo, index) => {
              return <img key={index} src={photo} />;
            })}
          </div>
          <div className="col-sm-6">
            <Header rank={1} style="Title">{project.title}</Header>
            <p>{project.description ? project.description.description : ''}</p>
            {project.client ? <p><strong>Client:</strong> {project.client}</p> : undefined}
            {project.projectCompletionDate ? <p><strong>Project completed:</strong> {project.projectCompletionDate}</p> : undefined}
          </div>
        </div>
      </Layout>
    )  
  }
}

export const query = graphql`
  query($slug: String!) {
    allContentfulProject(filter: {slug: {eq: $slug}}) {
      edges {
        node {
          title
          client
          projectCompletionDate(formatString: "MMMM DD, YYYY")
          description {
            description
            id
          }
          photos {
            id
            resolutions {
              src
              srcSet
            }
          }
        }
      }
    }
  }
`
