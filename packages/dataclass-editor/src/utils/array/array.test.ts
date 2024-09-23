import { areArraysIdentical } from './array';

describe('areArraysIdentical', () => {
  describe('true', () => {
    test('sorted', () => {
      expect(areArraysIdentical(['A', 'B', 'C'], ['A', 'B', 'C'])).toBeTruthy();
    });

    test('not sorted', () => {
      const array1 = ['B', 'A', 'C'];
      const array2 = ['C', 'B', 'A'];
      expect(areArraysIdentical(array1, array2)).toBeTruthy();
      expect(array1).toEqual(['B', 'A', 'C']);
      expect(array2).toEqual(['C', 'B', 'A']);
    });
  });

  describe('false', () => {
    test('different length', () => {
      expect(areArraysIdentical(['A', 'B', 'C'], ['A', 'B'])).toBeFalsy();
    });

    test('different elements', () => {
      expect(areArraysIdentical(['A', 'B', 'C'], ['A', 'B', 'D'])).toBeFalsy();
    });
  });
});
