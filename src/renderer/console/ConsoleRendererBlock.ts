import type { Point } from '../../types';
import type { RendererBlock } from '../RendererBlock';

export default class ConsoleRendererBlock implements RendererBlock {
  constructor(
    public readonly position: Point,
    public readonly value: number | null,
  ) {}

  getLabel(): string {
    return this.value !== null
      ? (this.value < 10 ? `  ${this.value}` : ` ${this.value}`)
      : '   ';
  }

  hightlight(): void {
    console.log(`Move "${this.value || 'empty'}" block`);
  }
}
