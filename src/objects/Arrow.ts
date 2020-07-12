import Location from '../types/Location';
import { ctx } from '../services/visualize';
import { rotate, calcDistance } from '../services/geometry';

const ARROW_HEAD_LENGTH = 15;
const RADIAN_VALUE_FOR_20_DEG = 0.3490658503988659;

class Arrow {
  endPosition: Location;
  startPosition: Location;
  arrowHead: {
    point1: Location;
    point2: Location;
    point3: Location;
  }

  constructor(startPos: Location, endPos: Location) {
    this.startPosition = startPos;
    this.endPosition = endPos;

    const length = calcDistance(startPos, endPos);
    const unitVector = {
      x: (endPos.x - startPos.x) / length,
      y: (endPos.y - startPos.y) / length
    }
    const inLinePoint = {
      x: endPos.x - unitVector.x * ARROW_HEAD_LENGTH,
      y: endPos.y - unitVector.y * ARROW_HEAD_LENGTH,
    };

    this.arrowHead = {
      point1: rotate(inLinePoint, this.endPosition, RADIAN_VALUE_FOR_20_DEG),
      point2: rotate(inLinePoint, this.endPosition, -RADIAN_VALUE_FOR_20_DEG),
      point3: this.endPosition
    }
  }

  draw() {
    ctx.beginPath()
    ctx.moveTo(this.startPosition.x, this.startPosition.y);
    ctx.lineTo(this.endPosition.x, this.endPosition.y);
    ctx.stroke();
    ctx.closePath();

    // Draw arrow head
    ctx.beginPath();
    ctx.moveTo(this.endPosition.x, this.endPosition.y);
    ctx.lineTo(this.arrowHead.point1.x, this.arrowHead.point1.y);
    ctx.lineTo(this.arrowHead.point2.x, this.arrowHead.point2.y);
    ctx.lineTo(this.arrowHead.point3.x, this.arrowHead.point3.y);
    ctx.stroke();
    ctx.closePath();
  }
}

export default Arrow;
