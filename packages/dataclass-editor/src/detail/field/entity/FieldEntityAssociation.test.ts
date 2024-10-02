import { customRenderHook } from '../../../context/test-utils/test-utils';
import type { DataClassFieldEntityAssociation, EntityClassField } from '../../../data/dataclass';
import { useCardinality, useMappedByFieldName } from './FieldEntityAssociation';

describe('useMappedByFieldName', () => {
  test('clear modifiers', () => {
    const field = {
      modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE', 'NOT_UPDATEABLE', 'UNIQUE'],
      entity: { mappedByFieldName: 'mappedByFieldName' }
    } as EntityClassField;
    let newField = {} as EntityClassField;
    const view = customRenderHook(() => useMappedByFieldName(), {
      wrapperProps: { entityFieldContext: { field, setField: field => (newField = field) } }
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
          wrapperProps: { entityFieldContext: { field } }
        });
        expect(view.result.current.isDisabled).toBeTruthy();
      });

      test('association is many-to-one', () => {
        const field = { entity: { association: 'MANY_TO_ONE' } } as EntityClassField;
        const view = customRenderHook(() => useMappedByFieldName(), {
          wrapperProps: { entityFieldContext: { field } }
        });
        expect(view.result.current.isDisabled).toBeTruthy();
      });
    });

    describe('false', () => {
      test('association is one-to-one', () => {
        const field = { entity: { association: 'ONE_TO_ONE' } } as EntityClassField;
        const view = customRenderHook(() => useMappedByFieldName(), {
          wrapperProps: { entityFieldContext: { field } }
        });
        expect(view.result.current.isDisabled).toBeFalsy();
      });

      test('association is one-to-many', () => {
        const field = { entity: { association: 'ONE_TO_MANY' } } as EntityClassField;
        const view = customRenderHook(() => useMappedByFieldName(), {
          wrapperProps: { entityFieldContext: { field } }
        });
        expect(view.result.current.isDisabled).toBeFalsy();
      });
    });
  });
});

describe('useCardinality', () => {
  const expectAssociation = (
    field: EntityClassField,
    association: DataClassFieldEntityAssociation | undefined,
    mappedByFieldName: string,
    orphanRemoval: boolean
  ) => {
    expect(field.entity.association).toEqual(association);
    expect(field.entity.mappedByFieldName).toEqual(mappedByFieldName);
    expect(field.entity.orphanRemoval).toEqual(orphanRemoval);
  };

  describe('clear properties', () => {
    test('to none', () => {
      const field = {
        entity: { association: 'ONE_TO_ONE', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true }
      } as EntityClassField;
      let newField = {} as EntityClassField;
      const view = customRenderHook(() => useCardinality(), {
        wrapperProps: { entityFieldContext: { field, setField: field => (newField = field) } }
      });
      expect(view.result.current.cardinality).toEqual('ONE_TO_ONE');

      const originalField = structuredClone(field);
      view.result.current.setCardinality(undefined as unknown as DataClassFieldEntityAssociation);
      expect(field).toEqual(originalField);

      expectAssociation(newField, undefined, '', false);
    });

    test('to many-to-one', () => {
      const field = {
        entity: { association: 'ONE_TO_ONE', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true }
      } as EntityClassField;
      let newField = {} as EntityClassField;
      const view = customRenderHook(() => useCardinality(), {
        wrapperProps: { entityFieldContext: { field, setField: field => (newField = field) } }
      });
      expect(view.result.current.cardinality).toEqual('ONE_TO_ONE');

      const originalDataClass = structuredClone(field);
      view.result.current.setCardinality('MANY_TO_ONE');
      expect(field).toEqual(originalDataClass);

      expectAssociation(newField, 'MANY_TO_ONE', '', false);
    });
  });

  describe('keep properties', () => {
    test('to one-to-one', () => {
      const field = {
        entity: { association: 'ONE_TO_MANY', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true }
      } as EntityClassField;
      let newField = {} as EntityClassField;
      const view = customRenderHook(() => useCardinality(), {
        wrapperProps: { entityFieldContext: { field, setField: field => (newField = field) } }
      });
      expect(view.result.current.cardinality).toEqual('ONE_TO_MANY');

      const originalField = structuredClone(field);
      view.result.current.setCardinality('ONE_TO_ONE');
      expect(field).toEqual(originalField);

      expectAssociation(newField, 'ONE_TO_ONE', 'mappedByFieldName', true);
    });

    test('to many-to-one', () => {
      const field = {
        entity: { association: 'ONE_TO_ONE', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true }
      } as EntityClassField;
      let newField = {} as EntityClassField;
      const view = customRenderHook(() => useCardinality(), {
        wrapperProps: { entityFieldContext: { field, setField: field => (newField = field) } }
      });
      expect(view.result.current.cardinality).toEqual('ONE_TO_ONE');

      const originalField = structuredClone(field);
      view.result.current.setCardinality('ONE_TO_MANY');
      expect(field).toEqual(originalField);

      expectAssociation(newField, 'ONE_TO_MANY', 'mappedByFieldName', true);
    });
  });
});
