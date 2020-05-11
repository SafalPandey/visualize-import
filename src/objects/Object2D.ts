import Location from '../types/Location';

class Object2D {
  position: Location;
  vertices: Location[];

  constructor(pos: Location) {
    this.position = pos;
    this.vertices = [pos];
  }

  getVertices() {
    return this.vertices;
  }

  draw() {}
}

export default Object2D;
