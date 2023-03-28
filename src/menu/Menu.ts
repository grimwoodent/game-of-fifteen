import { assertTargetElement } from '../utils';
import './menu.scss';

export default class Menu {
  private readonly triggerElement: HTMLElement;

  private isOpened = true;

  constructor(
    private targetElement: HTMLElement
  ) {
    assertTargetElement(targetElement);
    this.triggerElement = targetElement.querySelector('.js-trigger');
    assertTargetElement(this.triggerElement);
    this.triggerElement.addEventListener('click', this.toggle.bind(this));
  }

  toggle() {
    if (this.isOpened) {
      this.collapse();
    } else {
      this.open();
    }
  }

  open() {
    this.targetElement.classList.remove('collapsed');
    this.isOpened = true;
  }

  collapse() {
    this.targetElement.classList.add('collapsed');
    this.isOpened = false;
  }
}
