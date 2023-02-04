import type { Field } from '../field/Field';
import type { Point } from '../types';
import type { MOVE_DIRECTION } from '../enums';

export interface RendererEvents {
  requestMoveBlock?(position: Point): void;
}

export interface Renderer {
  init(field: Field, events?: RendererEvents): void;
  render(): void;
  moveBlock(point: Point, direction: MOVE_DIRECTION): Promise<void>;
}
