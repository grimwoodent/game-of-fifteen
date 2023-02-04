import type { Point } from '../types';

export interface RendererBlock {
  readonly position: Point;
  readonly value: number | null;
}
