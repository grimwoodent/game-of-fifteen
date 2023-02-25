import type { Point } from './types';

export function isPointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

export function getSwapsCount(matrix: Array<number | null>): number {
  let result = 0;

  for (let i = 0; i < matrix.length - 1; i++) {
    for (let j = i + 1; j < matrix.length; j++) {
      if (
        matrix[j] !== null
        && matrix[i] !== null
        && matrix[i] > matrix[j]
      ) {
        result++;
      }
    }
  }

  return result;
}


export function findEmptyCellRowIndex(matrix: Array<number | null>): number {
  const sideSize = Math.sqrt(matrix.length);
  if (sideSize - Math.trunc(sideSize) > 0) { throw new Error('Non square matrix'); }

  const cellIndex = matrix.findIndex((cell) => cell === null);
  if (cellIndex === -1) { return -1; }

  return Math.trunc(cellIndex / sideSize);
}

/**
 * - If N is odd, then puzzle instance is solvable if number of inversions is even in the input state.
 *
 * - If N is even, puzzle instance is solvable
 *     a) if the blank is on an even row counting from the bottom (second-last, fourth-last, etc.)
 *   and number of inversions is odd.
 *     b) the blank is on an odd row counting from the bottom (last, third-last, fifth-last, etc.)
 *   and number of inversions is even.
 *
 * - For all other cases, the puzzle instance is not solvable.
 */
export function checkSolvability(matrix: Array<number | null>): boolean {
  const swapsCount = getSwapsCount(matrix);
  const sideSize = Math.sqrt(matrix.length);

  // odd
  if (sideSize % 2) { return !(swapsCount % 2); }

  const emptyCellRowNumber = findEmptyCellRowIndex(matrix);
  if (emptyCellRowNumber < 0) { return false; }

  if (emptyCellRowNumber % 2) { return !(swapsCount % 2); }
  return !!(swapsCount % 2);
}
