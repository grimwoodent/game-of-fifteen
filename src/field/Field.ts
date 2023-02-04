import type { Size } from '../types';

export interface Field {
  readonly size: Size;
  toMatrix(): Array<number | null>;
}
