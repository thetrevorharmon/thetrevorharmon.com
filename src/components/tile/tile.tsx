import * as React from "react";
import { Button } from '../../UI-Kit';

interface TileProps {
  project: Project;
}

const Tile: React.SFC<TileProps> = (props) => {
  return (
    <div>
      <h1>{props.project.title}</h1>
      <img src={props.project.photos[0].resolutions.src} />
      <Button href={`/${props.project.slug}`}>View more</Button>
    </div>
  )
}

export default Tile;
