import { customRenderHook } from '../../context/test-utils/test-utils';
import type { DataClassField } from '../../data/dataclass';
import { useType } from './FieldNameTypeComment';

describe('useType', () => {
  test('not id type', () => {
    const field = { type: 'String', modifiers: ['PERSISTENT', 'ID', 'GENERATED'] } as DataClassField;
    let newField = {} as DataClassField;
    const view = customRenderHook(() => useType(), {
      wrapperProps: { fieldContext: { field, setField: field => (newField = field) } }
    });
    expect(view.result.current.type).toEqual('String');

    const originalField = structuredClone(field);
    view.result.current.setType('Date');
    expect(field).toEqual(originalField);

    expect(newField.type).toEqual('Date');
    expect(newField.modifiers).toEqual(['PERSISTENT']);
  });

  test('not version type', () => {
    const field = { type: 'Short', modifiers: ['PERSISTENT', 'VERSION'] } as DataClassField;
    let newField = {} as DataClassField;
    const view = customRenderHook(() => useType(), {
      wrapperProps: { fieldContext: { field, setField: field => (newField = field) } }
    });
    expect(view.result.current.type).toEqual('Short');

    const originalField = structuredClone(field);
    view.result.current.setType('String');
    expect(field).toEqual(originalField);

    expect(newField.type).toEqual('String');
    expect(newField.modifiers).toEqual(['PERSISTENT']);
  });
});
