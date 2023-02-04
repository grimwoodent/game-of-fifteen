import type { Renderer } from './renderer/Renderer';
import LinearField from './field/LinearField';
import ConsoleRenderer from './renderer/console/ConsoleRenderer';
import DomRenderer from './renderer/dom/DomRenderer';
import type { Point } from './types';
import './index.scss';

class Game {
  private field = new LinearField(4, 4);

  constructor(
    private renderers: Renderer[],
  ) {}

  init(): Game {
    this.renderers.forEach((renderer) => renderer.init(this.field, {
      requestMoveBlock: async (point: Point) => {
        await this.moveBlock(point);
        this.render();
      },
    }));

    return this;
  }

  start(): void {
    this.render();
  }

  private async moveBlock(point: Point): Promise<void> {
    await Promise.allSettled(this.renderers.map((renderer) => renderer.moveBlock(point, 1)));
  }

  private render() {
    this.renderers.forEach((renderer) => renderer.render());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  (new Game([
    new ConsoleRenderer(),
    new DomRenderer(document.getElementById('content')),
  ])).init().start();
});
