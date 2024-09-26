import type { Mock } from 'vitest';
import { useAppContext } from '../../../context/AppContext';
import type { DataClass, DataClassField, DataClassFieldEntity, DataClassFieldEntityAssociation, DataClassFieldModifier } from './dataclass';
import { useDataClassChangeHandlers } from './dataclass-change-handlers';

vi.mock('../../../context/AppContext', () => {
  return {
    useAppContext: vi.fn()
  };
});

const setupAppContext = (dataClass: DataClass, selectedField?: number) => {
  const setDataClass = vi.fn();
  (useAppContext as Mock).mockReturnValue({
    dataClass: dataClass,
    setDataClass: setDataClass,
    selectedField: selectedField
  });
  return setDataClass;
};

test('handleDataClassPropertyChange', () => {
  const dataClass = { simpleName: 'simpleName' } as DataClass;
  const setDataClass = setupAppContext(dataClass);

  const { handleDataClassPropertyChange } = useDataClassChangeHandlers();

  const originalDataClass = structuredClone(dataClass);
  handleDataClassPropertyChange('simpleName', 'NewSimpleName');
  expect(dataClass).toEqual(originalDataClass);

  expect(setDataClass).toHaveBeenCalledOnce();
  expect(setDataClass.mock.calls[0][0].simpleName).toEqual('NewSimpleName');
});

test('handleDataClassEntityPropertyChange', () => {
  const dataClass = { entity: { tableName: 'tableName' } } as DataClass;
  const setDataClass = setupAppContext(dataClass);

  const { handleDataClassEntityPropertyChange } = useDataClassChangeHandlers();

  const originalDataClass = structuredClone(dataClass);
  handleDataClassEntityPropertyChange('tableName', 'NewTableName');
  expect(dataClass).toEqual(originalDataClass);

  expect(setDataClass).toHaveBeenCalledOnce();
  expect(setDataClass.mock.calls[0][0].entity.tableName).toEqual('NewTableName');
});

describe('handleClassTypeChange', () => {
  const expectClassType = (
    dataClass: DataClass,
    isBusinessCaseData: boolean,
    hasEntity: boolean,
    modifiers: Array<Array<DataClassFieldModifier>>
  ) => {
    expect(dataClass.isBusinessCaseData).toEqual(isBusinessCaseData);
    expect(!!dataClass.entity).toEqual(hasEntity);
    expect(dataClass.fields.every((field: DataClassField) => !!field.entity === hasEntity)).toBeTruthy();
    for (let i = 0; i < modifiers.length; i++) {
      expect(dataClass.fields[i].modifiers).toEqual(modifiers[i]);
    }
  };

  test('data to business', () => {
    const dataClass = {
      isBusinessCaseData: false,
      entity: undefined,
      fields: [
        { modifiers: ['PERSISTENT'], entity: undefined },
        { modifiers: [], entity: undefined }
      ]
    } as DataClass;
    const setDataClass = setupAppContext(dataClass);

    const { handleClassTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleClassTypeChange('BUSINESS_DATA');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expectClassType(setDataClass.mock.calls[0][0], true, false, [['PERSISTENT'], []]);
  });

  test('data to entity', () => {
    const dataClass = {
      isBusinessCaseData: false,
      entity: undefined,
      fields: [
        { modifiers: ['PERSISTENT'], entity: undefined },
        { modifiers: [], entity: undefined }
      ]
    } as DataClass;
    const setDataClass = setupAppContext(dataClass);

    const { handleClassTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleClassTypeChange('ENTITY');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expectClassType(setDataClass.mock.calls[0][0], false, true, [['PERSISTENT'], []]);
  });

  test('business to data', () => {
    const dataClass = {
      isBusinessCaseData: true,
      entity: undefined,
      fields: [
        { modifiers: ['PERSISTENT'], entity: undefined },
        { modifiers: [], entity: undefined }
      ]
    } as DataClass;
    const setDataClass = setupAppContext(dataClass);

    const { handleClassTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleClassTypeChange('DATA');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expectClassType(setDataClass.mock.calls[0][0], false, false, [['PERSISTENT'], []]);
  });

  test('business to entity', () => {
    const dataClass = {
      isBusinessCaseData: true,
      entity: undefined,
      fields: [
        { modifiers: ['PERSISTENT'], entity: undefined },
        { modifiers: [], entity: undefined }
      ]
    } as DataClass;
    const setDataClass = setupAppContext(dataClass);

    const { handleClassTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleClassTypeChange('ENTITY');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expectClassType(setDataClass.mock.calls[0][0], false, true, [['PERSISTENT'], []]);
  });

  test('entity to data', () => {
    const dataClass = {
      isBusinessCaseData: false,
      entity: {},
      fields: [
        { modifiers: ['PERSISTENT', 'ID', 'GENERATED'], entity: undefined },
        { modifiers: ['NOT_INSERTABLE', 'NOT_NULLABLE', 'NOT_UPDATEABLE', 'UNIQUE'], entity: undefined }
      ]
    } as DataClass;
    const setDataClass = setupAppContext(dataClass);

    const { handleClassTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleClassTypeChange('DATA');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expectClassType(setDataClass.mock.calls[0][0], false, false, [['PERSISTENT'], []]);
  });

  test('entity to business', () => {
    const dataClass = {
      isBusinessCaseData: false,
      entity: {},
      fields: [
        { modifiers: ['PERSISTENT', 'ID', 'GENERATED'], entity: undefined },
        { modifiers: ['NOT_INSERTABLE', 'NOT_NULLABLE', 'NOT_UPDATEABLE', 'UNIQUE'], entity: undefined }
      ]
    } as DataClass;
    const setDataClass = setupAppContext(dataClass);

    const { handleClassTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleClassTypeChange('BUSINESS_DATA');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expectClassType(setDataClass.mock.calls[0][0], true, false, [['PERSISTENT'], []]);
  });
});

test('handleFieldPropertyChange', () => {
  const dataClass = { fields: [{ name: 'name' }] } as DataClass;
  const setDataClass = setupAppContext(dataClass, 0);

  const { handleFieldPropertyChange } = useDataClassChangeHandlers();

  const originalDataClass = structuredClone(dataClass);
  handleFieldPropertyChange('name', 'NewName');
  expect(dataClass).toEqual(originalDataClass);

  expect(setDataClass).toHaveBeenCalledOnce();
  expect(setDataClass.mock.calls[0][0].fields[0].name).toEqual('NewName');
});

describe('handleFieldTypeChange', () => {
  test('not id type', () => {
    const dataClass = { fields: [{ type: 'String', modifiers: ['PERSISTENT', 'ID', 'GENERATED'] }] } as DataClass;
    const setDataClass = setupAppContext(dataClass, 0);

    const { handleFieldTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleFieldTypeChange('Date');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expect(setDataClass.mock.calls[0][0].fields[0].type).toEqual('Date');
    expect(setDataClass.mock.calls[0][0].fields[0].modifiers).toEqual(['PERSISTENT']);
  });

  test('not version type', () => {
    const dataClass = { fields: [{ type: 'Short', modifiers: ['PERSISTENT', 'VERSION'] }] } as DataClass;
    const setDataClass = setupAppContext(dataClass, 0);

    const { handleFieldTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleFieldTypeChange('String');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expect(setDataClass.mock.calls[0][0].fields[0].type).toEqual('String');
    expect(setDataClass.mock.calls[0][0].fields[0].modifiers).toEqual(['PERSISTENT']);
  });
});

describe('handleFieldModifierChange', () => {
  test('add', () => {
    const dataClass = { fields: [{ modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE'] }] } as DataClass;
    const setDataClass = setupAppContext(dataClass, 0);

    const { handleFieldModifierChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleFieldModifierChange(true, 'UNIQUE');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expect(setDataClass.mock.calls[0][0].fields[0].modifiers).toEqual(['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE', 'UNIQUE']);
  });

  test('remove', () => {
    const dataClass = { fields: [{ modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE'] }] } as DataClass;
    const setDataClass = setupAppContext(dataClass, 0);

    const { handleFieldModifierChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleFieldModifierChange(false, 'NOT_INSERTABLE');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expect(setDataClass.mock.calls[0][0].fields[0].modifiers).toEqual(['PERSISTENT', 'NOT_NULLABLE']);
  });

  describe('id', () => {
    test('add', () => {
      const dataClass = { fields: [{ modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE'] }] } as DataClass;
      const setDataClass = setupAppContext(dataClass, 0);

      const { handleFieldModifierChange } = useDataClassChangeHandlers();

      const originalDataClass = structuredClone(dataClass);
      handleFieldModifierChange(true, 'ID');
      expect(dataClass).toEqual(originalDataClass);

      expect(setDataClass).toHaveBeenCalledOnce();
      expect(setDataClass.mock.calls[0][0].fields[0].modifiers).toEqual(['PERSISTENT', 'ID']);
    });

    test('remove', () => {
      const dataClass = { fields: [{ modifiers: ['PERSISTENT', 'ID', 'GENERATED'] }] } as DataClass;
      const setDataClass = setupAppContext(dataClass, 0);

      const { handleFieldModifierChange } = useDataClassChangeHandlers();

      const originalDataClass = structuredClone(dataClass);
      handleFieldModifierChange(false, 'ID');
      expect(dataClass).toEqual(originalDataClass);

      expect(setDataClass).toHaveBeenCalledOnce();
      expect(setDataClass.mock.calls[0][0].fields[0].modifiers).toEqual(['PERSISTENT']);
    });
  });

  test('version', () => {
    const dataClass = { fields: [{ modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE'] }] } as DataClass;
    const setDataClass = setupAppContext(dataClass, 0);

    const { handleFieldModifierChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleFieldModifierChange(true, 'VERSION');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expect(setDataClass.mock.calls[0][0].fields[0].modifiers).toEqual(['PERSISTENT', 'VERSION']);
  });
});

test('handleFieldEntityPropertyChange', () => {
  const dataClass = { entity: {}, fields: [{ entity: { databaseName: 'databaseName' } }] } as DataClass;
  const setDataClass = setupAppContext(dataClass, 0);

  const { handleFieldEntityPropertyChange } = useDataClassChangeHandlers();

  const originalDataClass = structuredClone(dataClass);
  handleFieldEntityPropertyChange('databaseName', 'NewDatabaseName');
  expect(dataClass).toEqual(originalDataClass);

  expect(setDataClass).toHaveBeenCalledOnce();
  expect(setDataClass.mock.calls[0][0].fields[0].entity.databaseName).toEqual('NewDatabaseName');
});

describe('handleFieldEntityAssociationChange', () => {
  const expectAssociation = (
    entity: DataClassFieldEntity,
    association: DataClassFieldEntityAssociation | undefined,
    mappedByFieldName: string,
    orphanRemoval: boolean
  ) => {
    expect(entity.association).toEqual(association);
    expect(entity.mappedByFieldName).toEqual(mappedByFieldName);
    expect(entity.orphanRemoval).toEqual(orphanRemoval);
  };

  describe('clear properties', () => {
    test('to none', () => {
      const dataClass = {
        entity: {},
        fields: [{ entity: { association: 'ONE_TO_ONE', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true } }]
      } as DataClass;
      const setDataClass = setupAppContext(dataClass, 0);

      const { handleFieldEntityAssociationChange } = useDataClassChangeHandlers();

      const originalDataClass = structuredClone(dataClass);
      handleFieldEntityAssociationChange(undefined);
      expect(dataClass).toEqual(originalDataClass);

      expect(setDataClass).toHaveBeenCalledOnce();
      expectAssociation(setDataClass.mock.calls[0][0].fields[0].entity, undefined, '', false);
    });

    test('to many-to-one', () => {
      const dataClass = {
        entity: {},
        fields: [{ entity: { association: 'ONE_TO_ONE', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true } }]
      } as DataClass;
      const setDataClass = setupAppContext(dataClass, 0);

      const { handleFieldEntityAssociationChange } = useDataClassChangeHandlers();

      const originalDataClass = structuredClone(dataClass);
      handleFieldEntityAssociationChange('MANY_TO_ONE');
      expect(dataClass).toEqual(originalDataClass);

      expect(setDataClass).toHaveBeenCalledOnce();
      expectAssociation(setDataClass.mock.calls[0][0].fields[0].entity, 'MANY_TO_ONE', '', false);
    });
  });

  describe('keep properties', () => {
    test('to one-to-one', () => {
      const dataClass = {
        entity: {},
        fields: [{ entity: { association: 'ONE_TO_MANY', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true } }]
      } as DataClass;
      const setDataClass = setupAppContext(dataClass, 0);

      const { handleFieldEntityAssociationChange } = useDataClassChangeHandlers();

      const originalDataClass = structuredClone(dataClass);
      handleFieldEntityAssociationChange('ONE_TO_ONE');
      expect(dataClass).toEqual(originalDataClass);

      expect(setDataClass).toHaveBeenCalledOnce();
      expectAssociation(setDataClass.mock.calls[0][0].fields[0].entity, 'ONE_TO_ONE', 'mappedByFieldName', true);
    });

    test('to many-to-one', () => {
      const dataClass = {
        entity: {},
        fields: [{ entity: { association: 'ONE_TO_ONE', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true } }]
      } as DataClass;
      const setDataClass = setupAppContext(dataClass, 0);

      const { handleFieldEntityAssociationChange } = useDataClassChangeHandlers();

      const originalDataClass = structuredClone(dataClass);
      handleFieldEntityAssociationChange('ONE_TO_MANY');
      expect(dataClass).toEqual(originalDataClass);

      expect(setDataClass).toHaveBeenCalledOnce();
      expectAssociation(setDataClass.mock.calls[0][0].fields[0].entity, 'ONE_TO_MANY', 'mappedByFieldName', true);
    });
  });
});

describe('handleFieldEntityCascadeTypeChange', () => {
  test('add', () => {
    const dataClass = {
      entity: {},
      fields: [{ entity: { cascadeTypes: ['MERGE', 'PERSIST'] } }]
    } as DataClass;
    const setDataClass = setupAppContext(dataClass, 0);

    const { handleFieldEntityCascadeTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleFieldEntityCascadeTypeChange(true, 'REFRESH');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expect(setDataClass.mock.calls[0][0].fields[0].entity.cascadeTypes).toEqual(['MERGE', 'PERSIST', 'REFRESH']);
  });

  test('remove', () => {
    const dataClass = {
      entity: {},
      fields: [{ entity: { cascadeTypes: ['MERGE', 'PERSIST'] } }]
    } as DataClass;
    const setDataClass = setupAppContext(dataClass, 0);

    const { handleFieldEntityCascadeTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleFieldEntityCascadeTypeChange(false, 'MERGE');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expect(setDataClass.mock.calls[0][0].fields[0].entity.cascadeTypes).toEqual(['PERSIST']);
  });

  test('add ALL', () => {
    const dataClass = {
      entity: {},
      fields: [{ entity: { cascadeTypes: ['MERGE', 'PERSIST'] } }]
    } as DataClass;
    const setDataClass = setupAppContext(dataClass, 0);

    const { handleFieldEntityCascadeTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleFieldEntityCascadeTypeChange(true, 'ALL');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expect(setDataClass.mock.calls[0][0].fields[0].entity.cascadeTypes).toEqual(['ALL']);
  });

  test('remove ALL', () => {
    const dataClass = {
      entity: {},
      fields: [{ entity: { cascadeTypes: ['ALL'] } }]
    } as DataClass;
    const setDataClass = setupAppContext(dataClass, 0);

    const { handleFieldEntityCascadeTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleFieldEntityCascadeTypeChange(false, 'ALL');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expect(setDataClass.mock.calls[0][0].fields[0].entity.cascadeTypes).toEqual([]);
  });

  test('add last', () => {
    const dataClass = {
      entity: {},
      fields: [{ entity: { cascadeTypes: ['MERGE', 'PERSIST', 'REMOVE'] } }]
    } as DataClass;
    const setDataClass = setupAppContext(dataClass, 0);

    const { handleFieldEntityCascadeTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleFieldEntityCascadeTypeChange(true, 'REFRESH');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expect(setDataClass.mock.calls[0][0].fields[0].entity.cascadeTypes).toEqual(['ALL']);
  });

  test('remove first', () => {
    const dataClass = {
      entity: {},
      fields: [{ entity: { cascadeTypes: ['ALL'] } }]
    } as DataClass;
    const setDataClass = setupAppContext(dataClass, 0);

    const { handleFieldEntityCascadeTypeChange } = useDataClassChangeHandlers();

    const originalDataClass = structuredClone(dataClass);
    handleFieldEntityCascadeTypeChange(false, 'MERGE');
    expect(dataClass).toEqual(originalDataClass);

    expect(setDataClass).toHaveBeenCalledOnce();
    expect(setDataClass.mock.calls[0][0].fields[0].entity.cascadeTypes).toEqual(['PERSIST', 'REMOVE', 'REFRESH']);
  });
});

test('handleFieldEntityMappedByFieldNameChange', () => {
  const dataClass = {
    entity: {},
    fields: [
      {
        modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE', 'NOT_UPDATEABLE', 'UNIQUE'],
        entity: { mappedByFieldName: 'mappedByFieldName' }
      }
    ]
  } as DataClass;
  const setDataClass = setupAppContext(dataClass, 0);

  const { handleFieldEntityMappedByFieldNameChange } = useDataClassChangeHandlers();

  const originalDataClass = structuredClone(dataClass);
  handleFieldEntityMappedByFieldNameChange('NewMappedByFieldName');
  expect(dataClass).toEqual(originalDataClass);

  expect(setDataClass).toHaveBeenCalledOnce();
  expect(setDataClass.mock.calls[0][0].fields[0].entity.mappedByFieldName).toEqual('NewMappedByFieldName');
  expect(setDataClass.mock.calls[0][0].fields[0].modifiers).toEqual(['PERSISTENT']);
});
