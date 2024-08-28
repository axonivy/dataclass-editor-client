import type { DataClass } from './dataclass';
import { isEntityClass } from './dataclass-utils';

let dataClass: DataClass;

beforeEach(() => {
  dataClass = {
    $schema: 'schema',
    simpleName: 'DataClassField',
    namespace: 'String',
    comment: 'comment',
    annotations: [],
    isBusinessCaseData: false,
    fields: []
  };
});

describe('dataclass-utils', () => {
  describe('isEntityClass', () => {
    test('true', () => {
      dataClass.entity = {
        tableName: 'tableName'
      };
      expect(isEntityClass(dataClass)).toBeTruthy();
    });

    test('false', () => {
      expect(isEntityClass(dataClass)).toBeFalsy();
    });
  });
});
