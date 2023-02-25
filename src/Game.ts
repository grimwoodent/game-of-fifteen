import type { Renderer } from './renderer/Renderer';
import LinearField from './field/LinearField';

export default class Game {
  private field: LinearField | null = null;

  constructor(
    private renderers: Renderer[],
  ) {}

  init(size: number): Game {
    if (size < 2 || size > 5) { throw new Error('Allowed only 2, 3, 4 and 5 sized fields'); }

    this.field = new LinearField(size, size);
    this.renderers.forEach((renderer) => renderer.init(this.field, {
      requestMoveValue: (value) => this.requestMoveBlock(value),
    }));

    return this;
  }

  start(): void {
    this.renderers.forEach((renderer) => {
      renderer.setCompletedInfoDisplayState(false);
      renderer.setFieldDisplayState(true);
    });
    this.render();
  }

  async requestMoveBlock(value: number | null): Promise<void> {
    if (!this.field) { throw new Error('Game is not inited'); }
    if (typeof value !== 'number') { throw new Error('Input type must be Number'); }

    const direction = this.field.moveValue(value);

    if (direction === null) {
      await Promise.allSettled(this.renderers.map((renderer) => renderer.cantMoveBlock(value)));
      return;
    }

    await Promise.allSettled(this.renderers.map((renderer) => renderer.moveBlock(value, direction)));
    await this.render();

    if (this.field.isCompleted) { this.displayCompleted(); }
  }

  private async render(): Promise<void> {
    await Promise.allSettled(this.renderers.map((renderer) => renderer.render()));
  }

  private displayCompleted(): void {
    this.renderers.forEach((renderer) => {
      renderer.setCompletedInfoDisplayState(true);
      renderer.setFieldDisplayState(false);
    });
  }
}
