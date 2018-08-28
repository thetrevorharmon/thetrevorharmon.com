import * as React from "react";
import Link from "gatsby-link"

interface TileProps {
  project: Project;
}

const Tile: React.SFC<TileProps> = (props) => {
  console.log(props.project.slug)
  return (
    <div>
      <h1>{props.project.title}</h1>
      <img src={props.project.photos[0].resolutions.src} />
      <Link to={`/project?slug=${props.project.slug}`}>View more</Link>
    </div>
  )
}

export default Tile;
