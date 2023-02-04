import type { Field } from './Field';
import type { Size } from '../types';

export default class LinearField implements Field {
  private readonly values: Array<number | null> = [];

  constructor(
    private width: number,
    private height: number,
  ) {
    this.values = (new Array(width * height)).fill(null);
    for (let i = 0; i < width * height - 1; i++) { this.values[i] = i + 1; }
  }

  get size(): Size {
    return {
      width: this.width,
      height: this.height,
    };
  }

  toMatrix(): Array<number | null> {
    return [...this.values];
  }
}
