import type { DataClass } from './dataclass';
import { validateFieldName, validateFieldType } from './validation-utils';

const dataClass = {
  fields: [{ name: 'takenName' }]
} as DataClass;

describe('validateFieldName', () => {
  test('valid', () => {
    expect(validateFieldName('Name', dataClass)).toBeUndefined();
  });

  describe('invalid', () => {
    describe('blank', () => {
      test('empty', () => {
        expect(validateFieldName('', dataClass)).toEqual({ message: 'Name cannot be empty.', variant: 'error' });
      });

      test('whitespace', () => {
        expect(validateFieldName('   ', dataClass)).toEqual({ message: 'Name cannot be empty.', variant: 'error' });
      });
    });

    test('taken', () => {
      expect(validateFieldName('takenName', dataClass)).toEqual({ message: 'Name is already taken.', variant: 'error' });
    });
  });
});

describe('validateFieldType', () => {
  test('valid', () => {
    expect(validateFieldType('Type')).toBeUndefined();
  });

  describe('invalid', () => {
    test('empty', () => {
      expect(validateFieldType('')).toEqual({ message: 'Type cannot be empty.', variant: 'error' });
    });

    test('whitespace', () => {
      expect(validateFieldType('   ')).toEqual({ message: 'Type cannot be empty.', variant: 'error' });
    });
  });
});
