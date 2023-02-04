import type { Point } from './types';

export function isPointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}
