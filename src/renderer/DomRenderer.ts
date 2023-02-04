import type { Renderer, RendererEvents } from './Renderer';
import type { Field } from '../field/Field';
import { ACTION_CLASS } from '../enums';
import '../styles/dom-renderer.scss';

function assertTargetElement(target: HTMLElement): void {
  if (!target || !(target instanceof HTMLElement) || !target.isConnected) {
    throw new Error('Renderer target element not found');
  }
}

export default class DomRenderer implements Renderer {
  protected rendererEvents: RendererEvents = {};

  constructor(
    protected targetElement: HTMLElement,
  ) {}

  init(rendererEvents?: RendererEvents): void {
    this.rendererEvents = rendererEvents || {};
    assertTargetElement(this.targetElement);
    this.targetElement.addEventListener('click', this.onMainElementClick.bind(this));
  }

  render(field: Field): void {
    assertTargetElement(this.targetElement);
    const { height, width } = field.size;
    const matrix = field.toMatrix();

    this.targetElement.innerHTML = '';

    for (let y = 0; y < height; y++) {
      const lineElement = document.createElement('div');

      for (let x = 0; x < width; x++) {
        const value = matrix[y * width + x];
        const block = document.createElement('span');

        block.innerHTML = String(value || '');
        block.classList.add(ACTION_CLASS.BLOCK);
        block.dataset.x = String(x);
        block.dataset.y = String(y);
        lineElement.append(block);
      }

      this.targetElement.append(lineElement);
    }
  }

  protected onMainElementClick(e: Event): void {
    const target = e.target || e.srcElement;
    if (!target || !(target instanceof HTMLElement)) { return; }
    if (!target.classList.contains(ACTION_CLASS.BLOCK)) { return; }
    if (!target.dataset.x || !target.dataset.y) { return; }

    this.rendererEvents.moveBlock?.(
      parseInt(target.dataset.x, 10),
      parseInt(target.dataset.y, 10),
    );
  }
}
