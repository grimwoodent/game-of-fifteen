import type { Field } from '../field/Field';
import type { MOVE_DIRECTION } from '../enums';

export interface RendererEvents {
  requestMoveValue?(value: number | null): void;
}

export interface Renderer {
  init(field: Field, events?: RendererEvents): void;
  setFieldDisplayState(state: boolean): Promise<void>;
  setCompletedInfoDisplayState(state: boolean): Promise<void>;
  render(): Promise<void>;
  moveBlock(value: number | null, direction: MOVE_DIRECTION): Promise<void>;
  cantMoveBlock(value: number | null): Promise<void>;
}
