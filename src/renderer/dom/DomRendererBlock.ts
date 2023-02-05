import type { Point } from '../../types';
import type { RendererBlock } from '../RendererBlock';
import { ACTION_CLASS } from './enums';
import { assertTargetElement } from './utils';
import { MOVE_DIRECTION } from '../../enums';

export default class DomRendererBlock implements RendererBlock {
  protected readonly element: HTMLElement;

  constructor(
    public readonly position: Point,
    public readonly value: number | null,
  ) {
    this.element = document.createElement('span');
    this.element.innerHTML = String(value || '');
    this.element.classList.add(ACTION_CLASS.BLOCK);
    this.element.dataset.x = String(position.x);
    this.element.dataset.y = String(position.y);
  }

  isElement(targetElement: HTMLElement): boolean {
    return this.element === targetElement;
  }

  appendTo(targetElement: HTMLElement): void {
    assertTargetElement(targetElement);
    targetElement.append(this.element);
  }

  showMoved(direction: MOVE_DIRECTION): Promise<void> {
    return new Promise((resolve) => {
      this.element.classList.add('active');
      window.setTimeout(() => {
        this.element.classList.remove('active');
        resolve();
      }, 300);
    });
  }

  showBlocked(): Promise<void> {
    return new Promise((resolve) => {
      this.element.classList.add('blocked');
      window.setTimeout(() => {
        this.element.classList.remove('blocked');
        resolve();
      }, 300);
    });
  }
}
