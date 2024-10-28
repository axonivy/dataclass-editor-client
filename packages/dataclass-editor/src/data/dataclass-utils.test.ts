import type { DataClass } from '@axonivy/dataclass-editor-protocol';
import { classTypeOf, isEntity } from './dataclass-utils';

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
