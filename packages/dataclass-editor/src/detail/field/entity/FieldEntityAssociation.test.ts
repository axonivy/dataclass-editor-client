import type { Association, EntityClassField } from '@axonivy/dataclass-editor-protocol';
import { customRenderHook } from '../../../context/test-utils/test-utils';
import { cardinalityMessage, useCardinality, useMappedByFieldName } from './FieldEntityAssociation';

describe('useMappedByFieldName', () => {
  test('clear modifiers', () => {
    const field = {
      modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE', 'NOT_UPDATEABLE', 'UNIQUE'],
      entity: { mappedByFieldName: 'mappedByFieldName' }
    } as EntityClassField;
    let newField = {} as EntityClassField;
    const view = customRenderHook(() => useMappedByFieldName(), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field as EntityClassField) } }
    });
    expect(view.result.current.mappedByFieldName).toEqual('mappedByFieldName');

    const originalField = structuredClone(field);
    view.result.current.setMappedByFieldName('NewMappedByFieldName');
    expect(field).toEqual(originalField);

    expect(newField.modifiers).toEqual(['PERSISTENT']);
  });

  describe('disabled', () => {
    describe('true', () => {
      test('association is undefined', () => {
        const field = { entity: {} } as EntityClassField;
        const view = customRenderHook(() => useMappedByFieldName(), {
          wrapperProps: { detailContext: { field } }
        });
        expect(view.result.current.isDisabled).toBeTruthy();
      });

      test('association is many-to-one', () => {
        const field = { entity: { association: 'MANY_TO_ONE' } } as EntityClassField;
        const view = customRenderHook(() => useMappedByFieldName(), {
          wrapperProps: { detailContext: { field } }
        });
        expect(view.result.current.isDisabled).toBeTruthy();
      });
    });

    describe('false', () => {
      test('association is one-to-one', () => {
        const field = { entity: { association: 'ONE_TO_ONE' } } as EntityClassField;
        const view = customRenderHook(() => useMappedByFieldName(), {
          wrapperProps: { detailContext: { field } }
        });
        expect(view.result.current.isDisabled).toBeFalsy();
      });

      test('association is one-to-many', () => {
        const field = { entity: { association: 'ONE_TO_MANY' } } as EntityClassField;
        const view = customRenderHook(() => useMappedByFieldName(), {
          wrapperProps: { detailContext: { field } }
        });
        expect(view.result.current.isDisabled).toBeFalsy();
      });
    });
  });
});

describe('useCardinality', () => {
  test('to none', () => {
    const field = {
      entity: { association: 'ONE_TO_ONE', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true }
    } as EntityClassField;
    let newField = {} as EntityClassField;
    const view = customRenderHook(() => useCardinality(), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field as EntityClassField) } }
    });
    expect(view.result.current.cardinality).toEqual('ONE_TO_ONE');

    const originalField = structuredClone(field);
    view.result.current.setCardinality(undefined as unknown as Association);
    expect(field).toEqual(originalField);

    expect(newField.entity.association).toBeUndefined();
    expect(newField.entity.mappedByFieldName).toEqual('');
    expect(newField.entity.orphanRemoval).toBeFalsy();
  });

  test('to many-to-one', () => {
    const field = {
      entity: { association: 'ONE_TO_ONE', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true }
    } as EntityClassField;
    let newField = {} as EntityClassField;
    const view = customRenderHook(() => useCardinality(), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field as EntityClassField) } }
    });
    expect(view.result.current.cardinality).toEqual('ONE_TO_ONE');

    const originalDataClass = structuredClone(field);
    view.result.current.setCardinality('MANY_TO_ONE');
    expect(field).toEqual(originalDataClass);

    expect(newField.entity.association).toEqual('MANY_TO_ONE');
    expect(newField.entity.mappedByFieldName).toEqual('');
    expect(newField.entity.orphanRemoval).toBeFalsy();
  });

  test('to one-to-one', () => {
    const field = {
      entity: { association: 'ONE_TO_MANY', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true }
    } as EntityClassField;
    let newField = {} as EntityClassField;
    const view = customRenderHook(() => useCardinality(), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field as EntityClassField) } }
    });
    expect(view.result.current.cardinality).toEqual('ONE_TO_MANY');

    const originalField = structuredClone(field);
    view.result.current.setCardinality('ONE_TO_ONE');
    expect(field).toEqual(originalField);

    expect(newField.entity.association).toEqual('ONE_TO_ONE');
    expect(newField.entity.mappedByFieldName).toEqual('');
    expect(newField.entity.orphanRemoval).toBeFalsy();
  });

  test('to many-to-one', () => {
    const field = {
      entity: { association: 'ONE_TO_ONE', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true }
    } as EntityClassField;
    let newField = {} as EntityClassField;
    const view = customRenderHook(() => useCardinality(), {
      wrapperProps: { detailContext: { field, setField: field => (newField = field as EntityClassField) } }
    });
    expect(view.result.current.cardinality).toEqual('ONE_TO_ONE');

    const originalField = structuredClone(field);
    view.result.current.setCardinality('ONE_TO_MANY');
    expect(field).toEqual(originalField);

    expect(newField.entity.association).toEqual('ONE_TO_MANY');
    expect(newField.entity.mappedByFieldName).toEqual('');
    expect(newField.entity.orphanRemoval).toBeFalsy();
  });
});

describe('cardinalityMessage', () => {
  test('one-to-many association returns a warning', () => {
    expect(cardinalityMessage('ONE_TO_MANY')).toBeDefined();
  });

  test('other associations return nothing', () => {
    expect(cardinalityMessage()).toBeUndefined();
    expect(cardinalityMessage('ONE_TO_ONE')).toBeUndefined();
    expect(cardinalityMessage('MANY_TO_ONE')).toBeUndefined();
  });
});
