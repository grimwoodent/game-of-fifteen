import type { MOVE_DIRECTION } from '../../enums';
import AbstractRenderer from '../AbstractRenderer';
import ConsoleRendererBlock from './ConsoleRendererBlock';

declare global {
  interface Window {
    moveNumber(value: number): void;
  }
}

export default class ConsoleRenderer extends AbstractRenderer<
  ConsoleRendererBlock
> {
  constructor() {
    super();
    window.moveNumber = (value: number) => {
      if (typeof value !== 'number') { throw new Error('Input type must be Number'); }
      this.rendererEvents.requestMoveValue?.(value);
    };
  }

  render(): Promise<void> {
    const field = this.field;
    if (!field) { throw new Error('Field not found'); }

    const { height, width } = field.size;
    const matrix = field.toMatrix();
    let result = '';
    this.blocks = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = matrix[y * width + x];
        const block = new ConsoleRendererBlock({ x, y }, value);
        this.blocks.push(block);
        result += block.getLabel();
      }

      result += '\r\n';
    }

    console.log(result + '\r\n');

    return Promise.resolve();
  }

  async moveBlock(value: number | null): Promise<void> {
    const block = this.findBlockByValue(value);
    await block?.showMoved();
  }

  async cantMoveBlock(value: number | null): Promise<void> {
    const block = this.findBlockByValue(value);
    await block?.showBlocked();
  }

  displayCompleted(): Promise<void> {
    console.log('Completed!');
    return Promise.resolve();
  }
}
