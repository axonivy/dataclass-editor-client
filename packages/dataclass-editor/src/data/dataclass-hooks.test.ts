import { customRenderHook } from '../context/test-utils/test-utils';
import type { DataClass, DataClassField, EntityClassField } from './dataclass';
import { useDataClassProperty, useFieldEntityProperty, useFieldProperty } from './dataclass-hooks';

test('useDataClassProperty', () => {
  const dataClass = { simpleName: 'simpleName' } as DataClass;
  let newDataClass = {} as DataClass;
  const view = customRenderHook(() => useDataClassProperty(), {
    wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
  });
  expect(view.result.current.dataClass).toEqual(dataClass);

  const originalDataClass = structuredClone(dataClass);
  view.result.current.setProperty('simpleName', 'NewSimpleName');
  expect(dataClass).toEqual(originalDataClass);

  expect(newDataClass.simpleName).toEqual('NewSimpleName');
});

test('useFieldProperty', () => {
  const field = { name: 'name' } as DataClassField;
  let newField = {} as DataClassField;
  const view = customRenderHook(() => useFieldProperty(), {
    wrapperProps: { fieldContext: { field, setField: field => (newField = field) } }
  });
  expect(view.result.current.field).toEqual(field);

  const originalField = structuredClone(field);
  view.result.current.setProperty('name', 'NewName');
  expect(field).toEqual(originalField);

  expect(newField.name).toEqual('NewName');
});

test('useFieldEntityProperty', () => {
  const field = { entity: { databaseName: 'databaseName' } } as EntityClassField;
  let newField = {} as EntityClassField;
  const view = customRenderHook(() => useFieldEntityProperty(), {
    wrapperProps: { entityFieldContext: { field, setField: field => (newField = field) } }
  });
  expect(view.result.current.field).toEqual(field);

  const originalField = structuredClone(field);
  view.result.current.setProperty('databaseName', 'NewDatabaseName');
  expect(field).toEqual(originalField);

  expect(newField.entity.databaseName).toEqual('NewDatabaseName');
});
