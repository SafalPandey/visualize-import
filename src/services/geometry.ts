import Location from '../types/Location';
import Object2D from '../objects/Object2D';

export function computeClosestVertices(thing1: Object2D, thing2: Object2D) {
  let closestT1Vertex: Location;
  let closestT2Vertex: Location;
  let shortestDistance = Infinity;

  for (const t1Vert of thing1.vertices) {
    for (const t2Vert of thing2.vertices) {
      const distance = calcDistance(t1Vert, t2Vert);

      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestT1Vertex = t1Vert;
        closestT2Vertex = t2Vert;
      }
    }
  }

  return {
    shortestDistance,
    closestT1Vertex,
    closestT2Vertex,
  };
}

export function calcDistance(pos1: Location, pos2: Location) {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

export function rotate(point: Location, center: Location, angle: number): Location {
  const sine = Math.sin(angle)
  const cosine = Math.cos(angle);
  const xDiff = point.x - center.x;
  const yDiff = point.y - center.y;

  return {
    x: xDiff * cosine - yDiff * sine + center.x,
    y: xDiff * sine + yDiff * cosine + center.y
  }
}
