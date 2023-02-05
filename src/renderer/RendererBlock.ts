import type { Point } from '../types';
import type { MOVE_DIRECTION } from '../enums';

export interface RendererBlock {
  readonly position: Point;
  readonly value: number | null;
  showMoved(direction: MOVE_DIRECTION): Promise<void>;
  showBlocked(): Promise<void>;
}
