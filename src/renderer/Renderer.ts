import type { Field } from '../field/Field';

export interface RendererEvents {
  moveBlock?(x: number, y: number): void;
}

export interface Renderer {
  init(events?: RendererEvents): void;
  render(field: Field): void;
}
