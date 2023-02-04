import type { Point } from '../../types';
import type { RendererBlock } from '../RendererBlock';
import { ACTION_CLASS } from './enums';
import { assertTargetElement } from './utils';

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

  appendTo(targetElement: HTMLElement): void {
    assertTargetElement(targetElement);
    targetElement.append(this.element);
  }

  hightlight(timeout = 100): Promise<void> {
    return new Promise((resolve) => {
      this.element.classList.add('active');
      window.setTimeout(() => {
        this.element.classList.remove('active');
        resolve();
      }, timeout);
    });
  }
}
