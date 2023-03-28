import type { Point } from '../../types';
import type { RendererBlock } from '../RendererBlock';
import { ACTION_CLASS } from './enums';
import { assertTargetElement } from '../../utils';
import { MOVE_DIRECTION } from '../../enums';

const directionClassMap = {
  [MOVE_DIRECTION.UP]: 'move-up',
  [MOVE_DIRECTION.DOWN]: 'move-down',
  [MOVE_DIRECTION.LEFT]: 'move-left',
  [MOVE_DIRECTION.RIGHT]: 'move-right',
}

export default class DomRendererBlock implements RendererBlock {
  protected readonly element: HTMLElement;

  constructor(
    public readonly position: Point,
    public readonly value: number | null,
  ) {
    this.element = document.createElement('span');
    this.element.innerHTML = String(value || '');
    this.element.classList.add(ACTION_CLASS.BLOCK);
    if (value === null) { this.element.classList.add('empty'); }
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
      const moveAnimationClass = directionClassMap[direction];
      this.element.classList.add('active');
      if (moveAnimationClass) { this.element.classList.add(moveAnimationClass); }
      window.setTimeout(() => {
        this.element.classList.remove('active');
        if (moveAnimationClass) { this.element.classList.remove(moveAnimationClass); }
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
