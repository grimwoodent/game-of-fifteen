import type { Field } from './Field';

export default class LinearField implements Field {
  private readonly values: Array<number | null> = [];

  constructor(
    private width: number,
    private height: number,
  ) {
    this.values = (new Array(width * height)).fill(null);
    for (let i = 0; i < width * height - 1; i++) { this.values[i] = i + 1; }
  }

  get size(): { width: number; height: number } {
    return {
      width: this.width,
      height: this.height,
    };
  }

  toMatrix(): Array<number | null> {
    return [...this.values];
  }
}
