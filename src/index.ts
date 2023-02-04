import type { Renderer } from './renderer/Renderer';
import ConsoleRenderer from './renderer/ConsoleRenderer';
import LinearField from './field/LinearField';
import DomRenderer from './renderer/DomRenderer';
import './styles/index.scss';

class Game {
  private field = new LinearField(4, 4);

  constructor(
    private renderers: Renderer[],
  ) {}

  init(): Game {
    this.renderers.forEach((renderer) => renderer.init({
      moveBlock: (x: number, y: number) => {
        this.moveBlock(x, y);
        this.render();
      },
    }));


    return this;
  }

  start(): void {
    this.render();
  }

  private moveBlock(x: number, y: number) {
    console.log(x, y);
  }

  private render() {
    this.renderers.forEach((renderer) => renderer.render(this.field));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  (new Game([
    new ConsoleRenderer(),
    new DomRenderer(document.getElementById('field')),
  ])).init().start();
});
