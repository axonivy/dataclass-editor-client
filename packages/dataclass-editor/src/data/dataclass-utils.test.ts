import type { DataClass, Field, Modifier } from '@axonivy/dataclass-editor-protocol';
import { classTypeOf, isEntity, isEntityField } from './dataclass-utils';

describe('classTypeOf', () => {
  test('data', () => {
    const dataClass = {} as DataClass;
    expect(classTypeOf(dataClass)).toEqual('DATA');
  });

  test('businessData', () => {
    const dataClass = { isBusinessCaseData: true } as DataClass;
    expect(classTypeOf(dataClass)).toEqual('BUSINESS_DATA');
  });

  test('entity', () => {
    const dataClass = { entity: {} } as DataClass;
    expect(classTypeOf(dataClass)).toEqual('ENTITY');
  });
});

describe('isEntity', () => {
  test('true', () => {
    const dataClass = { entity: {} } as DataClass;
    expect(isEntity(dataClass)).toBeTruthy();
  });

  test('false', () => {
    const dataClass = {} as DataClass;
    expect(isEntity(dataClass)).toBeFalsy();
  });
});

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
