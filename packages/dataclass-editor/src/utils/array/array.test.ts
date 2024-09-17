import { removeEmptyStrings } from './array';

test('removeEmptyStrings', () => {
  expect(removeEmptyStrings(['one', '', '  three  ', '   ', 'five'])).toEqual(['one', '  three  ', 'five']);
});
