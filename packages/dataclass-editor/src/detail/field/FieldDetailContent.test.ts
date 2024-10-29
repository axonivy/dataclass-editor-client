import type { Field, Modifier } from '@axonivy/dataclass-editor-protocol';
import { isEntityField } from './FieldDetailContent';

describe('isEntityField', () => {
  test('true', () => {
    const field = { modifiers: ['PERSISTENT'], entity: {} } as Field;
    expect(isEntityField(field)).toBeTruthy();
  });

  describe('false', () => {
    test('missing modifier persistent', () => {
      const field = { modifiers: [] as Array<Modifier>, entity: {} } as Field;
      expect(isEntityField(field)).toBeFalsy();
    });

    test('missing entity', () => {
      const field = { modifiers: ['PERSISTENT'] } as Field;
      expect(isEntityField(field)).toBeFalsy();
    });
  });
});
