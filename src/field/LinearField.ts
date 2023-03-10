import type { Field } from './Field';
import type { Size } from '../types';
import { MOVE_DIRECTION } from '../enums';
import {
  fixSolvability,
  generateBlendedArray,
  isFieldCompleted,
} from './utils';

export default class LinearField implements Field {
  private readonly values: Array<number | null> = [];

  constructor(
    private width: number,
    private height: number,
  ) {
    if (width !== height) { throw new Error('Nonsquare fields is not implemented'); }
    this.values = fixSolvability(generateBlendedArray(width * height));
  }

  get size(): Size {
    return {
      width: this.width,
      height: this.height,
    };
  }

  get isCompleted(): boolean {
    return isFieldCompleted(this.toMatrix());
  }

  toMatrix(): Array<number | null> {
    return [...this.values];
  }

  moveValue(targetValue: number | null): MOVE_DIRECTION | null {
    let direction: MOVE_DIRECTION | null = null;

    if (targetValue === null) { return direction; }

    const valueIndex = this.values.findIndex((value) => value === targetValue);
    const nullIndex = this.values.findIndex((value) => value === null);

    if (valueIndex === -1 || nullIndex === -1) { return direction; }

    if (nullIndex - valueIndex === -1 && (valueIndex % this.width > 0)) {
      direction = MOVE_DIRECTION.LEFT;
    } else if (nullIndex - valueIndex === 1 && (nullIndex % this.width > 0)) {
      direction = MOVE_DIRECTION.RIGHT;
    } else if (nullIndex - valueIndex === -this.width) {
      direction = MOVE_DIRECTION.UP;
    } else if (nullIndex - valueIndex === this.width) {
      direction = MOVE_DIRECTION.DOWN;
    }

    if (direction !== null) {
      this.values[nullIndex] = targetValue;
      this.values[valueIndex] = null;
      return direction;
    }

    return null;
  }
}
