import type { Point } from '../../types';
import type { MOVE_DIRECTION } from '../../enums';
import AbstractRenderer from '../AbstractRenderer';
import DomRendererBlock from './DomRendererBlock';
import { ACTION_CLASS } from './enums';
import { assertTargetElement } from './utils';
import './dom-renderer.scss';

export default class DomRenderer extends AbstractRenderer<
  DomRendererBlock
> {
  protected fieldElement: HTMLElement;

  constructor(targetElement: HTMLElement) {
    super();
    assertTargetElement(targetElement);
    this.fieldElement = document.createElement('div');
    targetElement.append(this.fieldElement);
    this.fieldElement.classList.add('field');
    this.fieldElement.addEventListener('click', this.onMainElementClick.bind(this));
  }

  render(): void {
    const field = this.field;
    if (!field) { throw new Error('Field not found'); }

    assertTargetElement(this.fieldElement);
    const { height, width } = field.size;
    const matrix = field.toMatrix();

    this.fieldElement.innerHTML = '';
    this.blocks = [];

    for (let y = 0; y < height; y++) {
      const lineElement = document.createElement('div');

      this.fieldElement.append(lineElement);

      for (let x = 0; x < width; x++) {
        const value = matrix[y * width + x];
        const block = new DomRendererBlock({ x, y }, value);
        this.blocks.push(block);
        block.appendTo(lineElement);
      }
    }
  }

  async moveBlock(point: Point, direction: MOVE_DIRECTION): Promise<void> {
    const block = this.findBlockByPoint(point);
    await block?.hightlight();
  }

  protected onMainElementClick(e: Event): void {
    const target = e.target || e.srcElement;
    if (!target || !(target instanceof HTMLElement)) { return; }
    if (!target.classList.contains(ACTION_CLASS.BLOCK)) { return; }
    if (!target.dataset.x || !target.dataset.y) { return; }

    this.rendererEvents.requestMoveBlock?.({
      x: parseInt(target.dataset.x, 10),
      y: parseInt(target.dataset.y, 10),
    });
  }
}
