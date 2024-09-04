import type { DataClass, DataClassField } from './dataclass';
import { isEntityClass, newFieldName } from './dataclass-utils';

describe('isEntityClass', () => {
  test('true', () => {
    const dataClass = { entity: {} } as DataClass;
    expect(isEntityClass(dataClass)).toBeTruthy();
  });

  test('false', () => {
    const dataClass = {} as DataClass;
    expect(isEntityClass(dataClass)).toBeFalsy();
  });
});

test('newFieldName', () => {
  const dataClass = { fields: [] as Array<DataClassField> } as DataClass;
  expect(newFieldName(dataClass)).toEqual('newAttribute');
  dataClass.fields.push({ name: 'newAttribute' } as DataClassField);
  expect(newFieldName(dataClass)).toEqual('newAttribute2');
  dataClass.fields.push({ name: 'newAttribute2' } as DataClassField);
  expect(newFieldName(dataClass)).toEqual('newAttribute3');
});
