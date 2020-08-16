import Object2D from './Object2D';
import Location from '../types/Location';
import Dimension from '../types/Dimension';
import { ctx } from '../services/visualize';
import BoxOptions from '../types/BoxOptions';

class Box extends Object2D {
  background?: string;
  dimensions: Dimension;

  static getBoxVertices(box: Box) {
    return [
      box.position,
      {
        x: box.position.x + box.dimensions.width,
        y: box.position.y
      },
      {
        x: box.position.x,
        y: box.position.y + box.dimensions.height
      },
      {
        x: box.position.x + box.dimensions.width,
        y: box.position.y + box.dimensions.height
      }
    ];
  }

  constructor(pos: Location, dim: Dimension, opts?: BoxOptions) {
    super(pos);
    this.dimensions = dim;
    this.vertices = Box.getBoxVertices(this);

    if (opts) {
      this.background = opts.background;
    }
  }

  contains(x: number, y: number): boolean {
    return (
      x > this.position.x &&
      x < this.position.x + this.dimensions.width &&
      y > this.position.y &&
      y < this.position.y + this.dimensions.height
    );
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
    // const rx = this.dimensions.width / 2;
    // const ry = this.dimensions.height / 2;
    // ctx.ellipse(this.position.x + rx, this.position.y + ry, rx, ry, 0, 0, Math.PI * 2)
    ctx.stroke();

    if (this.background) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = this.background;
      ctx.fill();
      ctx.restore();
    }

    ctx.closePath();
  }
}

export default Box;
