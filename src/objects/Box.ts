import Location from '../types/Location';
import Dimension from '../types/Dimension';
import { ctx } from '../services/visualize';

class Box {
  position: Location;
  dimensions: Dimension;

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
