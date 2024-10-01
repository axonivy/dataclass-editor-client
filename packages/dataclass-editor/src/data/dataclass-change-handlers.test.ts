import type { DataClass, DataClassField, DataClassFieldEntity, DataClassFieldEntityAssociation, DataClassFieldModifier } from './dataclass';
import { useDataClassChangeHandlers } from './dataclass-change-handlers';
import { customRenderHook } from './test-utils/test-utils';

test('handleDataClassPropertyChange', () => {
  const dataClass = { simpleName: 'simpleName' } as DataClass;
  let newDataClass = {} as DataClass;
  const view = customRenderHook(() => useDataClassChangeHandlers(), {
    wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) }
  });

  const originalDataClass = structuredClone(dataClass);
  view.result.current.handleDataClassPropertyChange('simpleName', 'NewSimpleName');
  expect(dataClass).toEqual(originalDataClass);

  expect(newDataClass.simpleName).toEqual('NewSimpleName');
});

test('handleDataClassEntityPropertyChange', () => {
  const dataClass = { entity: { tableName: 'tableName' } } as DataClass;
  let newDataClass = {} as DataClass;
  const view = customRenderHook(() => useDataClassChangeHandlers(), {
    wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) }
  });

  const originalDataClass = structuredClone(dataClass);
  view.result.current.handleDataClassEntityPropertyChange('tableName', 'NewTableName');
  expect(dataClass).toEqual(originalDataClass);

  expect(newDataClass.entity?.tableName).toEqual('NewTableName');
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
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleClassTypeChange('BUSINESS_DATA');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, true, false, [['PERSISTENT'], []]);
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
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleClassTypeChange('ENTITY');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, false, true, [['PERSISTENT'], []]);
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
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleClassTypeChange('DATA');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, false, false, [['PERSISTENT'], []]);
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
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleClassTypeChange('ENTITY');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, false, true, [['PERSISTENT'], []]);
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
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleClassTypeChange('DATA');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, false, false, [['PERSISTENT'], []]);
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
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleClassTypeChange('BUSINESS_DATA');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, true, false, [['PERSISTENT'], []]);
  });
});

test('handleFieldPropertyChange', () => {
  const dataClass = { fields: [{ name: 'name' }] } as DataClass;
  let newDataClass = {} as DataClass;
  const view = customRenderHook(() => useDataClassChangeHandlers(), {
    wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
  });

  const originalDataClass = structuredClone(dataClass);
  view.result.current.handleFieldPropertyChange('name', 'NewName');
  expect(dataClass).toEqual(originalDataClass);

  expect(newDataClass.fields[0].name).toEqual('NewName');
});

describe('handleFieldTypeChange', () => {
  test('not id type', () => {
    const dataClass = { fields: [{ type: 'String', modifiers: ['PERSISTENT', 'ID', 'GENERATED'] }] } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleFieldTypeChange('Date');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].type).toEqual('Date');
    expect(newDataClass.fields[0].modifiers).toEqual(['PERSISTENT']);
  });

  test('not version type', () => {
    const dataClass = { fields: [{ type: 'Short', modifiers: ['PERSISTENT', 'VERSION'] }] } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleFieldTypeChange('String');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].type).toEqual('String');
    expect(newDataClass.fields[0].modifiers).toEqual(['PERSISTENT']);
  });
});

describe('handleFieldModifierChange', () => {
  test('add', () => {
    const dataClass = { fields: [{ modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE'] }] } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleFieldModifierChange(true, 'UNIQUE');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].modifiers).toEqual(['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE', 'UNIQUE']);
  });

  test('remove', () => {
    const dataClass = { fields: [{ modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE'] }] } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleFieldModifierChange(false, 'NOT_INSERTABLE');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].modifiers).toEqual(['PERSISTENT', 'NOT_NULLABLE']);
  });

  describe('id', () => {
    test('add', () => {
      const dataClass = { fields: [{ modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE'] }] } as DataClass;
      let newDataClass = {} as DataClass;
      const view = customRenderHook(() => useDataClassChangeHandlers(), {
        wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
      });

      const originalDataClass = structuredClone(dataClass);
      view.result.current.handleFieldModifierChange(true, 'ID');
      expect(dataClass).toEqual(originalDataClass);

      expect(newDataClass.fields[0].modifiers).toEqual(['PERSISTENT', 'ID']);
    });

    test('remove', () => {
      const dataClass = { fields: [{ modifiers: ['PERSISTENT', 'ID', 'GENERATED'] }] } as DataClass;
      let newDataClass = {} as DataClass;
      const view = customRenderHook(() => useDataClassChangeHandlers(), {
        wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
      });

      const originalDataClass = structuredClone(dataClass);
      view.result.current.handleFieldModifierChange(false, 'ID');
      expect(dataClass).toEqual(originalDataClass);

      expect(newDataClass.fields[0].modifiers).toEqual(['PERSISTENT']);
    });
  });

  test('version', () => {
    const dataClass = { fields: [{ modifiers: ['PERSISTENT', 'NOT_INSERTABLE', 'NOT_NULLABLE'] }] } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleFieldModifierChange(true, 'VERSION');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].modifiers).toEqual(['PERSISTENT', 'VERSION']);
  });
});

test('handleFieldEntityPropertyChange', () => {
  const dataClass = { entity: {}, fields: [{ entity: { databaseName: 'databaseName' } }] } as DataClass;
  let newDataClass = {} as DataClass;
  const view = customRenderHook(() => useDataClassChangeHandlers(), {
    wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
  });

  const originalDataClass = structuredClone(dataClass);
  view.result.current.handleFieldEntityPropertyChange('databaseName', 'NewDatabaseName');
  expect(dataClass).toEqual(originalDataClass);

  expect(newDataClass.fields[0].entity?.databaseName).toEqual('NewDatabaseName');
});

describe('handleFieldEntityCardinalityChange', () => {
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
      let newDataClass = {} as DataClass;
      const view = customRenderHook(() => useDataClassChangeHandlers(), {
        wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
      });

      const originalDataClass = structuredClone(dataClass);
      view.result.current.handleFieldEntityCardinalityChange(undefined);
      expect(dataClass).toEqual(originalDataClass);

      expectAssociation(newDataClass.fields[0].entity!, undefined, '', false);
    });

    test('to many-to-one', () => {
      const dataClass = {
        entity: {},
        fields: [{ entity: { association: 'ONE_TO_ONE', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true } }]
      } as DataClass;
      let newDataClass = {} as DataClass;
      const view = customRenderHook(() => useDataClassChangeHandlers(), {
        wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
      });

      const originalDataClass = structuredClone(dataClass);
      view.result.current.handleFieldEntityCardinalityChange('MANY_TO_ONE');
      expect(dataClass).toEqual(originalDataClass);

      expectAssociation(newDataClass.fields[0].entity!, 'MANY_TO_ONE', '', false);
    });
  });

  describe('keep properties', () => {
    test('to one-to-one', () => {
      const dataClass = {
        entity: {},
        fields: [{ entity: { association: 'ONE_TO_MANY', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true } }]
      } as DataClass;
      let newDataClass = {} as DataClass;
      const view = customRenderHook(() => useDataClassChangeHandlers(), {
        wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
      });

      const originalDataClass = structuredClone(dataClass);
      view.result.current.handleFieldEntityCardinalityChange('ONE_TO_ONE');
      expect(dataClass).toEqual(originalDataClass);

      expectAssociation(newDataClass.fields[0].entity!, 'ONE_TO_ONE', 'mappedByFieldName', true);
    });

    test('to many-to-one', () => {
      const dataClass = {
        entity: {},
        fields: [{ entity: { association: 'ONE_TO_ONE', mappedByFieldName: 'mappedByFieldName', orphanRemoval: true } }]
      } as DataClass;
      let newDataClass = {} as DataClass;
      const view = customRenderHook(() => useDataClassChangeHandlers(), {
        wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
      });

      const originalDataClass = structuredClone(dataClass);
      view.result.current.handleFieldEntityCardinalityChange('ONE_TO_MANY');
      expect(dataClass).toEqual(originalDataClass);

      expectAssociation(newDataClass.fields[0].entity!, 'ONE_TO_MANY', 'mappedByFieldName', true);
    });
  });
});

describe('handleFieldEntityCascadeTypeChange', () => {
  test('add', () => {
    const dataClass = {
      entity: {},
      fields: [{ entity: { cascadeTypes: ['MERGE', 'PERSIST'] } }]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleFieldEntityCascadeTypeChange(true, 'REFRESH');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].entity?.cascadeTypes).toEqual(['MERGE', 'PERSIST', 'REFRESH']);
  });

  test('remove', () => {
    const dataClass = {
      entity: {},
      fields: [{ entity: { cascadeTypes: ['MERGE', 'PERSIST'] } }]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleFieldEntityCascadeTypeChange(false, 'MERGE');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].entity?.cascadeTypes).toEqual(['PERSIST']);
  });

  test('add ALL', () => {
    const dataClass = {
      entity: {},
      fields: [{ entity: { cascadeTypes: ['MERGE', 'PERSIST'] } }]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleFieldEntityCascadeTypeChange(true, 'ALL');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].entity?.cascadeTypes).toEqual(['ALL']);
  });

  test('remove ALL', () => {
    const dataClass = {
      entity: {},
      fields: [{ entity: { cascadeTypes: ['ALL'] } }]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleFieldEntityCascadeTypeChange(false, 'ALL');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].entity?.cascadeTypes).toEqual([]);
  });

  test('add last', () => {
    const dataClass = {
      entity: {},
      fields: [{ entity: { cascadeTypes: ['MERGE', 'PERSIST', 'REMOVE'] } }]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleFieldEntityCascadeTypeChange(true, 'REFRESH');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].entity?.cascadeTypes).toEqual(['ALL']);
  });

  test('remove first', () => {
    const dataClass = {
      entity: {},
      fields: [{ entity: { cascadeTypes: ['ALL'] } }]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useDataClassChangeHandlers(), {
      wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
    });

    const originalDataClass = structuredClone(dataClass);
    view.result.current.handleFieldEntityCascadeTypeChange(false, 'MERGE');
    expect(dataClass).toEqual(originalDataClass);

    expect(newDataClass.fields[0].entity?.cascadeTypes).toEqual(['PERSIST', 'REMOVE', 'REFRESH']);
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
  let newDataClass = {} as DataClass;
  const view = customRenderHook(() => useDataClassChangeHandlers(), {
    wrapperProps: { dataClass, setDataClass: dataClass => (newDataClass = dataClass), selectedField: 0 }
  });

  const originalDataClass = structuredClone(dataClass);
  view.result.current.handleFieldEntityMappedByFieldNameChange('NewMappedByFieldName');
  expect(dataClass).toEqual(originalDataClass);

  expect(newDataClass.fields[0].entity?.mappedByFieldName).toEqual('NewMappedByFieldName');
  expect(newDataClass.fields[0].modifiers).toEqual(['PERSISTENT']);
});
