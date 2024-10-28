import { customRenderHook } from '../../context/test-utils/test-utils';
import type { DataClassField } from '@axonivy/dataclass-editor-protocol';
import { useFieldProperty } from './useFieldProperty';

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
