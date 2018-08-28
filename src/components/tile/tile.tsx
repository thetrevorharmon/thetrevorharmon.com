import * as React from "react";

interface TileProps {
  project: Project;
}

const Tile: React.SFC<TileProps> = (props) => {
  return (
    <div>
      <h1>{props.project.title}</h1>
      <img src={props.project.photos[0].resolutions.src} />
    </div>
  )
}

export default Tile;
