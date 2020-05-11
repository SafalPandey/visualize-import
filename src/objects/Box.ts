import Location from '../types/Location';
import Dimension from '../types/Dimension';
import { ctx } from '../services/visualize';

class Box {
  position: Location;
  dimensions: Dimension;

  static getBoxVertices(box: Box) {
    return [
      box.position,
      {
        x: box.position.x + box.dimensions.width,
        y: box.position.y,
      },
      {
        x: box.position.x,
        y: box.position.y + box.dimensions.height,
      },
      {
        x: box.position.x + box.dimensions.width,
        y: box.position.y + box.dimensions.height,
      },
    ];
  }

  constructor(pos: Location, dim: Dimension) {
    this.position = pos;
    this.dimensions = dim;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
    ctx.stroke();
    ctx.closePath();
  }
}

export default Box;
