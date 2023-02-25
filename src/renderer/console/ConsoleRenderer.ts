import type { MOVE_DIRECTION } from '../../enums';
import AbstractRenderer from '../AbstractRenderer';
import ConsoleRendererBlock from './ConsoleRendererBlock';

export default class ConsoleRenderer extends AbstractRenderer<
  ConsoleRendererBlock
> {
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

  async moveBlock(value: number | null, direction: MOVE_DIRECTION): Promise<void> {
    const block = this.findBlockByValue(value);
    await block?.showMoved(direction);
  }

  async cantMoveBlock(value: number | null): Promise<void> {
    const block = this.findBlockByValue(value);

    if (!block) {
      console.log(`Block "${value}" not found`);
      return;
    }

    await block.showBlocked();
  }

  setFieldDisplayState(state: boolean): Promise<void> {
    if (state) {
      console.log(
`***************************************
         Game commands:
         
   Start new Game for N-sized field: 
       game.restartGame(N);
       
     Move N number block: 
       game.moveNumber(N);
       
***************************************
`);
    }
    return Promise.resolve();
  }

  setCompletedInfoDisplayState(state: boolean): Promise<void> {
    if (state) { console.log('Completed!'); }
    return Promise.resolve();
  }
}
