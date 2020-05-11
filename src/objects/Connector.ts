import Arrow from './Arrow';
import Object2D from './Object2D';
import { computeClosestVertices } from '../services/geometry';

class Connector extends Arrow {
  thing1: Object2D;
  thing2: Object2D;

  constructor(thing1: Object2D, thing2: Object2D) {
    const closestVertices = computeClosestVertices(thing1, thing2);
    const startPos = closestVertices.closestT1Vertex;
    const endPos = closestVertices.closestT2Vertex;

    super(startPos, endPos);
    this.thing1 = thing1;
    this.thing2 = thing2;
  }
}

export default Connector;
