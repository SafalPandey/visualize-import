import Box from './Box';
import TextBox from './TextBox';
import Location from '../types/Location';
import Dimension from '../types/Dimension';
import { TEXT_HEIGHT } from '../services/visualize';
import BoxContainerOptions from '../types/BoxContainerOptions';

class BoxContainer extends TextBox {
  static computeBoxProps(obj: Box | Box[]) {
    let position: Location;
    let dimensions: Dimension;

    if (Array.isArray(obj)) {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = 0;
      let maxY = 0;

      for (const box of obj) {
        for (const vertex of box.vertices) {
          if (vertex.x < minX) minX = vertex.x;
          if (vertex.x > maxX) maxX = vertex.x;
          if (vertex.y < minY) minY = vertex.y;
          if (vertex.y > maxY) maxY = vertex.y;
        }
      }

      position = { x: minX, y: minY };
      dimensions = { width: maxX - minX, height: maxY - minY };
    } else {
      position = obj.position;
      dimensions = obj.dimensions;
    }

    return { position, dimensions };
  }

  constructor(boxes: Box | Box[], text?: string, opts?: BoxContainerOptions) {
    const boxProps = BoxContainer.computeBoxProps(boxes);

    super(boxProps.position, text, opts);
    const innerWidth = this.textWidth > boxProps.dimensions.width ? this.textWidth : boxProps.dimensions.width;

    this.dimensions = {
      height: boxProps.dimensions.height + this.textHeight + TEXT_HEIGHT,
      width: innerWidth + TEXT_HEIGHT * 4
    };
    this.position = {
      x: boxProps.position.x - TEXT_HEIGHT * 2,
      y: boxProps.position.y - this.textHeight
    };
    this.vertices = Box.getBoxVertices(this);
    this.textPosition = {
      x: this.position.x + TEXT_HEIGHT * 2,
      y: this.position.y
    };
  }

  draw() {
    super.draw();
  }
}

export default BoxContainer;
