import type { Point } from '../../types';
import type { RendererBlock } from '../RendererBlock';
import { MOVE_DIRECTION } from '../../enums';

export default class ConsoleRendererBlock implements RendererBlock {
  constructor(
    public readonly position: Point,
    public readonly value: number | null,
  ) {}

  getLabel(): string {
    return this.value !== null
      ? (this.value < 10 ? `  ${this.value}` : ` ${this.value}`)
      : '   ';
  }

  showMoved(): Promise<void> {
    console.log(`Move "${this.value || 'empty'}" block`);
    return Promise.resolve();
  }

  showBlocked(): Promise<void> {
    console.log(`Can't move "${this.value || 'empty'}" block`);
    return Promise.resolve();
  }
}
