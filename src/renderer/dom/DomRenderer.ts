import type { MOVE_DIRECTION } from '../../enums';
import AbstractRenderer from '../AbstractRenderer';
import DomRendererBlock from './DomRendererBlock';
import { ACTION_CLASS } from './enums';
import { assertTargetElement, nextAnimationFrame } from '../../utils';
import './dom-renderer.scss';

export default class DomRenderer extends AbstractRenderer<
  DomRendererBlock
> {
  protected fieldElement: HTMLElement;

  protected completedElement: HTMLElement | null = null;

  constructor(targetElement: HTMLElement) {
    super();
    assertTargetElement(targetElement);
    targetElement.innerHTML = '';
    this.fieldElement = document.createElement('div');
    targetElement.append(this.fieldElement);
    this.fieldElement.classList.add('field');
    this.fieldElement.addEventListener('click', this.onMainElementClick.bind(this));

    this.completedElement = document.createElement('div');
    targetElement.append(this.completedElement);
    this.completedElement.innerText = 'Completed!';
    this.completedElement.classList.add('completed');
  }

  async setFieldDisplayState(state: boolean): Promise<void> {
    if (state) {
      this.fieldElement.classList.add('shown');
    } else {
      this.fieldElement.classList.remove('shown');
    }
    await nextAnimationFrame();
  }

  async setCompletedInfoDisplayState(state: boolean): Promise<void> {
    if (state) {
      this.completedElement.classList.add('shown');
    } else {
      this.completedElement.classList.remove('shown');
    }
    await nextAnimationFrame();
  }

  async render(): Promise<void> {
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

    await nextAnimationFrame();
  }

  async moveBlock(value: number | null, direction: MOVE_DIRECTION): Promise<void> {
    const block = this.findBlockByValue(value);
    await block?.showMoved(direction);
  }

  async cantMoveBlock(value: number | null): Promise<void> {
    const block = this.findBlockByValue(value);
    await block?.showBlocked();
  }

  protected onMainElementClick(e: Event): void {
    const target = e.target || e.srcElement;
    if (!target || !(target instanceof HTMLElement)) { return; }
    if (!target.classList.contains(ACTION_CLASS.BLOCK)) { return; }

    const block = this.blocks.find((block) => block.isElement(target));
    if (!block) { return; }

    this.rendererEvents.requestMoveValue?.(block.value);
  }
}
