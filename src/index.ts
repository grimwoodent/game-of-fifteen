import type { Renderer } from './renderer/Renderer';
import LinearField from './field/LinearField';
import ConsoleRenderer from './renderer/console/ConsoleRenderer';
import DomRenderer from './renderer/dom/DomRenderer';
import './index.scss';

class Game {
  private field = new LinearField(4, 4);

  constructor(
    private renderers: Renderer[],
  ) {}

  init(): Game {
    this.renderers.forEach((renderer) => renderer.init(this.field, {
      requestMoveValue: (value) => this.requestMoveBlock(value),
    }));

    return this;
  }

  start(): void {
    this.render();
  }

  private async requestMoveBlock(value: number | null): Promise<void> {
    const direction = this.field.moveValue(value);

    if (direction === null) {
      await Promise.allSettled(this.renderers.map((renderer) => renderer.cantMoveBlock(value)));
      return;
    }

    await Promise.allSettled(this.renderers.map((renderer) => renderer.moveBlock(value, 1)));
    await this.render();

    if (this.field.isCompleted) { this.displayCompleted(); }
  }

  private async render(): Promise<void> {
    await Promise.allSettled(this.renderers.map((renderer) => renderer.render()));
  }

  private displayCompleted(): void {
    this.renderers.forEach((renderer) => renderer.displayCompleted());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  (new Game([
    new ConsoleRenderer(),
    new DomRenderer(document.getElementById('content')),
  ])).init().start();
});
