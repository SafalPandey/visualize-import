import Location from '../types/Location';
import { ctx } from '../services/visualize';

class Arrow {
  endPosition: Location;
  startPosition: Location;

  constructor(startPos: Location, endPos: Location) {
    this.startPosition = startPos;
    this.endPosition = endPos;
  }

  draw() {
    ctx.beginPath()
    ctx.moveTo(this.startPosition.x, this.startPosition.y);
    ctx.lineTo(this.endPosition.x, this.endPosition.y);
    // TODO: Change this circle to actual arrow
    ctx.arc(this.endPosition.x - 5, this.endPosition.y - 5, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath()
  }
}

export default Arrow;
