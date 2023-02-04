import type { Point } from '../../types';
import type { MOVE_DIRECTION } from '../../enums';
import AbstractRenderer from '../AbstractRenderer';
import ConsoleRendererBlock from './ConsoleRendererBlock';

export default class ConsoleRenderer extends AbstractRenderer<
  ConsoleRendererBlock
> {
  render(): void {
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
  }

  async moveBlock(point: Point, direction: MOVE_DIRECTION): Promise<void> {
    const block = this.findBlockByPoint(point);
    await block?.hightlight();
  }
}
