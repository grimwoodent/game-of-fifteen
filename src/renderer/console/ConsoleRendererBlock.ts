import type { Point } from '../../types';
import type { RendererBlock } from '../RendererBlock';
import { MOVE_DIRECTION } from '../../enums';

const directionLabelMap = {
  [MOVE_DIRECTION.UP]: ' up',
  [MOVE_DIRECTION.DOWN]: 'down',
  [MOVE_DIRECTION.LEFT]: 'left',
  [MOVE_DIRECTION.RIGHT]: 'right',
}

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

  showMoved(direction: MOVE_DIRECTION): Promise<void> {
    const label = directionLabelMap[direction] || 'unknown direction';
    console.log(`Move "${this.value || 'empty'}" block ${label}`);
    return Promise.resolve();
  }

  showBlocked(): Promise<void> {
    console.log(`Can't move "${this.value || 'empty'}" block`);
    return Promise.resolve();
  }
}
