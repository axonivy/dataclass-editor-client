import type { DataClassField, DataClassFieldModifier } from '@axonivy/dataclass-editor-protocol';
import { isEntityField } from './FieldDetailContent';

describe('isEntityField', () => {
  test('true', () => {
    const field = { modifiers: ['PERSISTENT'], entity: {} } as DataClassField;
    expect(isEntityField(field)).toBeTruthy();
  });

  describe('false', () => {
    test('missing modifier persistent', () => {
      const field = { modifiers: [] as Array<DataClassFieldModifier>, entity: {} } as DataClassField;
      expect(isEntityField(field)).toBeFalsy();
    });

    test('missing entity', () => {
      const field = { modifiers: ['PERSISTENT'] } as DataClassField;
      expect(isEntityField(field)).toBeFalsy();
    });
  });
});
