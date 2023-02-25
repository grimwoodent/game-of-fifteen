function getRandomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function swapCells(array: Array<number | null>, from: number, to: number): Array<number | null> {
  const result = [...array];
  result[from] = array[to];
  result[to] = array[from];
  return result;
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

export function fixSolvability(matrix: Array<number | null>): Array<number | null> {
  console.log(checkSolvability(matrix));
  if (checkSolvability(matrix)) { return matrix; }
  // just swap two first nonnull elements to make even inversions number
  let from = undefined;
  let to = undefined;
  for (const [index, cell] of matrix.entries()) {
    if (cell === null) { continue; }
    if (from === undefined) { from = index; continue; }
    to = index; break;
  }

  if (from === undefined || to === undefined) { throw new Error('Unsolvable field'); }

  return swapCells(matrix, from, to);
}

export function generateBlendedArray(size: number): Array<number | null> {
  const linearArray = (new Array(size - 1)).fill(null).map((_, index) => index + 1);
  const result: Array<number | null> = [];

  while (linearArray.length > 0) {
    const value = linearArray.splice(getRandomBetween(0, linearArray.length - 1), 1);
    if (!value.length) { break; }
    result.push(...value)
  }

  // keep null last one
  result.push(null);

  return result;
}

export function isFieldCompleted(matrix: Array<number | null>): boolean {
  // null is not last
  if (matrix[matrix.length - 1] !== null) { return false; }

  return matrix.findIndex((cell, index) => {
    // do not check last null element
    if (index + 1 >= matrix.length - 1) { return false; }
    const next = matrix[index + 1];
    // cell greater than next
    return cell >= next;
  }) === -1;
}
