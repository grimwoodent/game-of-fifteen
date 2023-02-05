import type { Size, Point } from '../types';
import type { MOVE_DIRECTION } from '../enums';

export interface Field {
  readonly size: Size;
  toMatrix(): Array<number | null>;
  moveValue(value: number | null): MOVE_DIRECTION | null;
}
