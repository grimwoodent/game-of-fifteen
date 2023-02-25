import { describe, expect, it } from '@jest/globals';

import {
  getSwapsCount,
  findEmptyCellRowIndex,
  checkSolvability,
} from './utils';

describe('utils', () => {
  describe('getSwapsCount', () => {
    it('should return 0 for zero swamp count', () => {
      expect(getSwapsCount([])).toBe(0);
      expect(getSwapsCount([null])).toBe(0);
      expect(getSwapsCount([1])).toBe(0);
      expect(getSwapsCount([1, null])).toBe(0);
      expect(getSwapsCount([1, 2])).toBe(0);
      expect(getSwapsCount([null, 1, 2])).toBe(0);
      expect(getSwapsCount([1, 2, 3, 4, 5])).toBe(0);
      expect(getSwapsCount([1, 2, null, 3, 4, 5])).toBe(0);
    });

    it('should count swaps', () => {
      expect(getSwapsCount([2, 1])).toBe(1);
      expect(getSwapsCount([2, 1, null])).toBe(1);
      expect(getSwapsCount([null, 2, 1])).toBe(1);
      expect(getSwapsCount([3, 2, 1])).toBe(3);
      expect(getSwapsCount([1, null, 3, 2])).toBe(1);
      expect(getSwapsCount([3, 2, 1, null])).toBe(3);
      expect(getSwapsCount([null, 3, 2, 1])).toBe(3);
      expect(getSwapsCount([3, 2, 1, 4])).toBe(3);
      expect(getSwapsCount([3, 2, 1, 4, 5])).toBe(3);
      expect(getSwapsCount([5, 3, 2, 1, 4])).toBe(7);
      expect(getSwapsCount([
        2, 1, 3,
        4, 5, 6,
        7, 8, null,
      ])).toBe(1);
    });
  });

  describe('findEmptyCellRowIndex', () => {
    it('should return -1 for a matrix without null', () => {
      expect(findEmptyCellRowIndex([])).toBe(-1);
      expect(findEmptyCellRowIndex([1])).toBe(-1);
      expect(findEmptyCellRowIndex([1, 2, 3, 4])).toBe(-1);
    });

    it('should find null row number', () => {
      expect(() => findEmptyCellRowIndex([1, null])).toThrowError();
      expect(() => findEmptyCellRowIndex([null, 1, 2, 3, 4])).toThrowError();

      expect(findEmptyCellRowIndex([null])).toBe(0);
      expect(findEmptyCellRowIndex([1, 2, 3, null])).toBe(1);
      expect(findEmptyCellRowIndex([1, 2, null, 3])).toBe(1);
      expect(findEmptyCellRowIndex([1, null, 2, 3])).toBe(0);
      expect(findEmptyCellRowIndex([null, 1, 2, 3])).toBe(0);
      expect(findEmptyCellRowIndex([1, 2, 3, 4, 5, 6, 7, 8, null])).toBe(2);
      expect(findEmptyCellRowIndex([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null])).toBe(3);
      expect(findEmptyCellRowIndex([1, 2, 3, 4, 5, 6, 7, null, 8, 9, 10, 11, 12, 13, 14, 15])).toBe(1);
    });
  });

  describe('checkSolvability', () => {
    it('should check sovability for even size (2)', () => {
      expect(checkSolvability([
        1, 2,
        3, null,
      ])).toBe(true);
      expect(checkSolvability([
        1, null,
        3, 2,
      ])).toBe(true);
      expect(checkSolvability([
        3, null,
        1, 2,
      ])).toBe(false);
    });

    it('should check sovability for odd size (3)', () => {
      expect(checkSolvability([
        1, 2, 3,
        4, 5, 6,
        7, 8, null,
      ])).toBe(true);
      expect(checkSolvability([
        1, 5, 2,
        4, null, 3,
        7, 8, 6,
      ])).toBe(true);
      expect(checkSolvability([
        1, null, 2,
        4, 5, 3,
        7, 8, 6,
      ])).toBe(true);
      expect(checkSolvability([
        2, 1, 3,
        4, 5, 6,
        7, 8, null,
      ])).toBe(false);
    });
  });
});
