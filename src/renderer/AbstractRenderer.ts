import type { Field } from '../field/Field';
import type { RendererBlock } from './RendererBlock';
import type { Renderer, RendererEvents } from './Renderer';
import type { Point } from '../types';
import type { MOVE_DIRECTION } from '../enums';
import { isPointsEqual } from '../utils';

export default abstract class AbstractRenderer<
  Block extends RendererBlock = RendererBlock
> implements Renderer {
  protected rendererEvents: RendererEvents = {};

  protected field?: Field;

  protected blocks: Block[] = [];

  init(field: Field, rendererEvents?: RendererEvents): void {
    this.field = field;
    this.rendererEvents = rendererEvents || {};
  }

  setFieldDisplayState(state: boolean): Promise<void> {
    return Promise.resolve();
  }

  setCompletedInfoDisplayState(state: boolean): Promise<void> {
    return Promise.resolve();
  }

  abstract render(): Promise<void>;

  abstract moveBlock(value: number | null, direction: MOVE_DIRECTION): Promise<void>;

  abstract cantMoveBlock(value: number | null): Promise<void>;

  findBlockByPoint(point: Point): Block | undefined {
    return this.blocks.find((block) => isPointsEqual(point, block.position));
  }

  findBlockByValue(value: number | null): Block | undefined {
    return this.blocks.find((block) => value === block.value);
  }
}
