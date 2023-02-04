import type { Renderer } from './Renderer';
import type { Field } from '../field/Field';

export default class ConsoleRenderer implements Renderer {
  init(): void {}

  render(field: Field): void {
    const { height, width } = field.size;
    const matrix = field.toMatrix();
    let result = '';

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = matrix[y * width + x];

        result += value !== null
          ? (value < 10 ? `  ${value}` : ` ${value}`)
          : '   ';
      }

      result += '\r\n';
    }

    console.log(result + '\r\n');
  }
}
