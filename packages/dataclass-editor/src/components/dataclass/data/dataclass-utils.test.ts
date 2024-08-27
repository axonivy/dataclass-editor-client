import type { DataClass } from './dataclass';
import { isEntityClass } from './dataclass-utils';

let dataClass: DataClass;

beforeEach(() => {
  dataClass = {
    $schema: 'schema',
    simpleName: 'DataClassField',
    namespace: 'String'
  };
});

describe('dataclass-utils', () => {
  describe('isEntityClass', () => {
    test('true', () => {
      dataClass.entity = {};
      expect(isEntityClass(dataClass)).toBeTruthy();
    });

    test('false', () => {
      expect(isEntityClass(dataClass)).toBeFalsy();
    });
  });
});
