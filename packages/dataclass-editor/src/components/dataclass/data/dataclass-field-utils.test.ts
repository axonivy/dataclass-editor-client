import { DataClassFieldModifier, type DataClassField } from './dataclass';
import { isPersistent } from './dataclass-field-utils';

let dataClassField: DataClassField;

beforeEach(() => {
  dataClassField = {
    name: 'DataClassField',
    type: 'String'
  };
});

describe('dataclass-field-utils', () => {
  describe('isPersistent', () => {
    test('true', () => {
      dataClassField.modifiers = [DataClassFieldModifier.PERSISTENT];
      expect(isPersistent(dataClassField)).toBeTruthy();
    });

    test('false', () => {
      dataClassField.modifiers = [DataClassFieldModifier.GENERATED, DataClassFieldModifier.ID];
      expect(isPersistent(dataClassField)).toBeFalsy();
    });

    test('modifiersIsNull', () => {
      expect(isPersistent(dataClassField)).toBeFalsy();
    });
  });
});
