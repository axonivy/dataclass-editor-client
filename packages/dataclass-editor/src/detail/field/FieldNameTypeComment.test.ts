import type { Field } from '@axonivy/dataclass-editor-protocol';
import { customRenderHook } from '../../context/test-utils/test-utils';
import { useType } from './FieldNameTypeComment';

describe('useType', () => {
  test('not id type', () => {
    const field = { type: 'String', modifiers: ['PERSISTENT', 'ID', 'GENERATED'] } as Field;
    let newField = {} as Field;
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
    const field = { type: 'Short', modifiers: ['PERSISTENT', 'VERSION'] } as Field;
    let newField = {} as Field;
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

  test('clear association', () => {
    const field = {
      type: 'String',
      modifiers: ['PERSISTENT'],
      entity: { association: 'ONE_TO_ONE', mappedByFieldName: 'MappedByFieldName', orphanRemoval: true }
    } as Field;
    let newField = {} as Field;
    const view = customRenderHook(() => useType(), {
      wrapperProps: { fieldContext: { field, setField: field => (newField = field) } }
    });
    expect(view.result.current.type).toEqual('String');

    const originalField = structuredClone(field);
    view.result.current.setType('Integer');
    expect(field).toEqual(originalField);

    expect(newField.type).toEqual('Integer');
    expect(newField.entity!.association).toBeUndefined();
    expect(newField.entity!.mappedByFieldName).toEqual('');
    expect(newField.entity!.orphanRemoval).toBeFalsy();
  });
});
