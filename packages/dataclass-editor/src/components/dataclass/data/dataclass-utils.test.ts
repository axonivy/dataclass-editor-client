import type { DataClass, DataClassField } from './dataclass';
import {
  className,
  classTypeOf,
  handleClassTypeChange,
  handleDataClassEntityPropertyChange,
  handleDataClassPropertyChange,
  handleFieldEntityAssociationChange,
  handleFieldEntityCascadeTypeChange,
  handleFieldEntityMappedByFieldNameChange,
  handleFieldEntityPropertyChange,
  handleFieldModifierChange,
  handleFieldPropertyChange,
  handleFieldTypeChange,
  headerTitles,
  isEntity,
  isEntityField
} from './dataclass-utils';
import { setupBusinessDataClass, setupDataClass, setupEntityClass } from './test-utils/setup';

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

  test('entity', () => {
    const dataClass = {} as DataClass;
    expect(isEntity(dataClass)).toBeFalsy();
  });
});

describe('isEntityField', () => {
  test('true', () => {
    const field = { entity: {} } as DataClassField;
    expect(isEntityField(field)).toBeTruthy();
  });

  test('entity', () => {
    const field = {} as DataClassField;
    expect(isEntityField(field)).toBeFalsy();
  });
});

describe('headerTitles', () => {
  describe('title', () => {
    test('data', () => {
      const dataClass = {} as DataClass;
      const { masterTitle } = headerTitles(dataClass);
      expect(masterTitle).toEqual('Data Editor');
    });

    test('businessData', () => {
      const dataClass = { isBusinessCaseData: true } as DataClass;
      const { masterTitle } = headerTitles(dataClass);
      expect(masterTitle).toEqual('Business Data Editor');
    });

    test('entity', () => {
      const dataClass = { entity: {} } as DataClass;
      const { masterTitle } = headerTitles(dataClass);
      expect(masterTitle).toEqual('Entity Editor');
    });
  });

  describe('detailTitle', () => {
    test('data', () => {
      const dataClass = { simpleName: 'DataClassName' } as DataClass;
      const { detailTitle } = headerTitles(dataClass);
      expect(detailTitle).toEqual('Data - DataClassName');
    });

    test('businessData', () => {
      const dataClass = { simpleName: 'BusinessDataClassName', isBusinessCaseData: true } as DataClass;
      const { detailTitle } = headerTitles(dataClass);
      expect(detailTitle).toEqual('Business Data - BusinessDataClassName');
    });

    test('entity', () => {
      const dataClass = { simpleName: 'EntityClassName', entity: {} } as DataClass;
      const { detailTitle } = headerTitles(dataClass);
      expect(detailTitle).toEqual('Entity - EntityClassName');
    });

    test('attribute', () => {
      const dataClass = { fields: [{ name: 'FieldName0' }, { name: 'FieldName1' }] } as DataClass;
      const { detailTitle } = headerTitles(dataClass, 1);
      expect(detailTitle).toEqual('Attribute - FieldName1');
    });
  });
});

describe('className', () => {
  test('qualified', () => {
    expect(className('ch.ivyteam.ivy.ClassName')).toEqual('ClassName');
  });

  test('notQualified', () => {
    expect(className('ClassName')).toEqual('ClassName');
  });
});

test('handleDataClassPropertyChange', () => {
  const { newDataClasses, dataClass, setDataClass } = setupDataClass();
  const originalDataClass = structuredClone(dataClass);
  handleDataClassPropertyChange('simpleName', 'NewSimpleName', dataClass, setDataClass);
  expect(dataClass).toEqual(originalDataClass);
  expect(newDataClasses).toHaveLength(1);
  expect(newDataClasses[0].simpleName).toEqual('NewSimpleName');
});

test('handleDataClassEntityPropertyChange', () => {
  const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
  const originalEntityClass = structuredClone(entityClass);
  handleDataClassEntityPropertyChange('tableName', 'NewTableName', entityClass, setEntityClass);
  expect(entityClass).toEqual(originalEntityClass);
  expect(newEntityClasses).toHaveLength(1);
  expect(newEntityClasses[0].entity.tableName).toEqual('NewTableName');
});

describe('handleClassTypeChange', () => {
  test('data to business', () => {
    const { newDataClasses, dataClass, setDataClass } = setupDataClass();
    const originalDataClass = structuredClone(dataClass);
    handleClassTypeChange('BUSINESS_DATA', dataClass, setDataClass);
    expect(dataClass).toEqual(originalDataClass);
    expect(newDataClasses).toHaveLength(1);
    expect(newDataClasses[0].isBusinessCaseData).toBeTruthy();
    expect(newDataClasses[0].entity).toBeUndefined();
    expect(newDataClasses[0].fields.every(field => field.entity === undefined)).toBeTruthy();
  });

  test('data to entity', () => {
    const { newDataClasses, dataClass, setDataClass } = setupDataClass();
    const originalDataClass = structuredClone(dataClass);
    handleClassTypeChange('ENTITY', dataClass, setDataClass);
    expect(dataClass).toEqual(originalDataClass);
    expect(newDataClasses).toHaveLength(1);
    expect(newDataClasses[0].isBusinessCaseData).toBeFalsy();
    expect(newDataClasses[0].entity).toBeDefined();
    expect(newDataClasses[0].fields.every(field => field.entity !== undefined)).toBeTruthy();
  });

  test('business to data', () => {
    const { newDataClasses, dataClass, setDataClass } = setupBusinessDataClass();
    const originalDataClass = structuredClone(dataClass);
    handleClassTypeChange('DATA', dataClass, setDataClass);
    expect(dataClass).toEqual(originalDataClass);
    expect(newDataClasses).toHaveLength(1);
    expect(newDataClasses[0].isBusinessCaseData).toBeFalsy();
    expect(newDataClasses[0].entity).toBeUndefined();
    expect(newDataClasses[0].fields.every(field => field.entity === undefined)).toBeTruthy();
  });

  test('business to entity', () => {
    const { newDataClasses, dataClass, setDataClass } = setupBusinessDataClass();
    const originalDataClass = structuredClone(dataClass);
    handleClassTypeChange('ENTITY', dataClass, setDataClass);
    expect(dataClass).toEqual(originalDataClass);
    expect(newDataClasses).toHaveLength(1);
    expect(newDataClasses[0].isBusinessCaseData).toBeFalsy();
    expect(newDataClasses[0].entity).toBeDefined();
    expect(newDataClasses[0].fields.every(field => field.entity !== undefined)).toBeTruthy();
  });

  test('entity to data', () => {
    const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
    const originalEntityClass = structuredClone(entityClass);
    handleClassTypeChange('DATA', entityClass, setEntityClass);
    expect(entityClass).toEqual(originalEntityClass);
    expect(newEntityClasses).toHaveLength(1);
    expect(newEntityClasses[0].isBusinessCaseData).toBeFalsy();
    expect(newEntityClasses[0].entity).toBeUndefined();
    expect(newEntityClasses[0].fields.every(field => field.entity === undefined)).toBeTruthy();
  });

  test('entity to business', () => {
    const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
    const originalEntityClass = structuredClone(entityClass);
    handleClassTypeChange('BUSINESS_DATA', entityClass, setEntityClass);
    expect(entityClass).toEqual(originalEntityClass);
    expect(newEntityClasses).toHaveLength(1);
    expect(newEntityClasses[0].isBusinessCaseData).toBeTruthy();
    expect(newEntityClasses[0].entity).toBeUndefined();
    expect(newEntityClasses[0].fields.every(field => field.entity === undefined)).toBeTruthy();
  });
});

test('handleFieldPropertyChange', () => {
  const { newDataClasses, dataClass, setDataClass } = setupDataClass();
  const originalDataClass = structuredClone(dataClass);
  handleFieldPropertyChange('name', 'NewName', dataClass, setDataClass, 1);
  expect(dataClass).toEqual(originalDataClass);
  expect(newDataClasses).toHaveLength(1);
  expect(newDataClasses[0].fields[1].name).toEqual('NewName');
});

describe('handleFieldTypeChange', () => {
  test('not id type', () => {
    const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
    entityClass.fields[1].type = 'String';
    entityClass.fields[1].modifiers.push('ID');
    entityClass.fields[1].modifiers.push('GENERATED');
    const originalEntityClass = structuredClone(entityClass);
    handleFieldTypeChange('Date', entityClass, setEntityClass, 1);
    expect(entityClass).toEqual(originalEntityClass);
    expect(newEntityClasses).toHaveLength(1);
    expect(newEntityClasses[0].fields[1].type).toEqual('Date');
    expect(newEntityClasses[0].fields[1].modifiers).toEqual(['PERSISTENT']);
  });

  test('not version type', () => {
    const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
    entityClass.fields[1].type = 'Short';
    entityClass.fields[1].modifiers.push('VERSION');
    const originalEntityClass = structuredClone(entityClass);
    handleFieldTypeChange('String', entityClass, setEntityClass, 1);
    expect(entityClass).toEqual(originalEntityClass);
    expect(newEntityClasses).toHaveLength(1);
    expect(newEntityClasses[0].fields[1].type).toEqual('String');
    expect(newEntityClasses[0].fields[1].modifiers).toEqual(['PERSISTENT']);
  });
});

describe('handleFieldModifierChange', () => {
  test('add', () => {
    const { newDataClasses, dataClass, setDataClass } = setupDataClass();
    const originalDataClass = structuredClone(dataClass);
    handleFieldModifierChange(true, 'UNIQUE', dataClass, setDataClass, 1);
    expect(dataClass).toEqual(originalDataClass);
    expect(newDataClasses).toHaveLength(1);
    expect(newDataClasses[0].fields[1].modifiers).toContain('UNIQUE');
  });

  test('remove', () => {
    const { newDataClasses, dataClass, setDataClass } = setupDataClass();
    const originalDataClass = structuredClone(dataClass);
    handleFieldModifierChange(false, 'PERSISTENT', dataClass, setDataClass, 1);
    expect(dataClass).toEqual(originalDataClass);
    expect(newDataClasses).toHaveLength(1);
    expect(newDataClasses[0].fields[1].modifiers).not.toContain('PERSISTENT');
  });

  describe('id', () => {
    test('add', () => {
      const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
      entityClass.fields[1].modifiers.push('NOT_NULLABLE');
      entityClass.fields[1].modifiers.push('NOT_INSERTABLE');
      const originalEntityClass = structuredClone(entityClass);
      handleFieldModifierChange(true, 'ID', entityClass, setEntityClass, 1);
      expect(entityClass).toEqual(originalEntityClass);
      expect(newEntityClasses).toHaveLength(1);
      expect(newEntityClasses[0].fields[1].modifiers).toEqual(['PERSISTENT', 'ID']);
    });

    test('remove', () => {
      const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
      entityClass.fields[1].modifiers.push('ID');
      entityClass.fields[1].modifiers.push('GENERATED');
      const originalEntityClass = structuredClone(entityClass);
      handleFieldModifierChange(false, 'ID', entityClass, setEntityClass, 1);
      expect(entityClass).toEqual(originalEntityClass);
      expect(newEntityClasses).toHaveLength(1);
      expect(newEntityClasses[0].fields[1].modifiers).toEqual(['PERSISTENT']);
    });
  });

  test('version', () => {
    const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
    entityClass.fields[1].modifiers.push('UNIQUE');
    entityClass.fields[1].modifiers.push('NOT_UPDATEABLE');
    const originalEntityClass = structuredClone(entityClass);
    handleFieldModifierChange(true, 'VERSION', entityClass, setEntityClass, 1);
    expect(entityClass).toEqual(originalEntityClass);
    expect(newEntityClasses).toHaveLength(1);
    expect(newEntityClasses[0].fields[1].modifiers).toEqual(['PERSISTENT', 'VERSION']);
  });
});

test('handleFieldEntityPropertyChange', () => {
  const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
  const originalEntityClass = structuredClone(entityClass);
  handleFieldEntityPropertyChange('databaseName', 'NewDatabaseName', entityClass, setEntityClass, 1);
  expect(entityClass).toEqual(originalEntityClass);
  expect(newEntityClasses).toHaveLength(1);
  expect(newEntityClasses[0].fields[1].entity.databaseName).toEqual('NewDatabaseName');
});

describe('handleFieldEntityAssociationChange', () => {
  describe('clear properties', () => {
    test('to none', () => {
      const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
      entityClass.fields[1].entity.association = 'ONE_TO_ONE';
      entityClass.fields[1].entity.orphanRemoval = true;
      const originalEntityClass = structuredClone(entityClass);
      handleFieldEntityAssociationChange(undefined, entityClass, setEntityClass, 1);
      expect(entityClass).toEqual(originalEntityClass);
      expect(newEntityClasses).toHaveLength(1);
      expect(newEntityClasses[0].fields[1].entity.mappedByFieldName).toEqual('');
      expect(newEntityClasses[0].fields[1].entity.orphanRemoval).toBeFalsy();
      expect(newEntityClasses[0].fields[1].entity.association).toBeUndefined();
    });

    test('to many-to-one', () => {
      const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
      entityClass.fields[1].entity.association = 'ONE_TO_MANY';
      entityClass.fields[1].entity.orphanRemoval = true;
      const originalEntityClass = structuredClone(entityClass);
      handleFieldEntityAssociationChange('MANY_TO_ONE', entityClass, setEntityClass, 1);
      expect(entityClass).toEqual(originalEntityClass);
      expect(newEntityClasses).toHaveLength(1);
      expect(newEntityClasses[0].fields[1].entity.mappedByFieldName).toEqual('');
      expect(newEntityClasses[0].fields[1].entity.orphanRemoval).toBeFalsy();
      expect(newEntityClasses[0].fields[1].entity.association).toEqual('MANY_TO_ONE');
    });
  });

  describe('keep properties', () => {
    test('to one-to-one', () => {
      const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
      entityClass.fields[1].entity.association = 'ONE_TO_MANY';
      entityClass.fields[1].entity.orphanRemoval = true;
      const originalEntityClass = structuredClone(entityClass);
      handleFieldEntityAssociationChange('ONE_TO_ONE', entityClass, setEntityClass, 1);
      expect(entityClass).toEqual(originalEntityClass);
      expect(newEntityClasses).toHaveLength(1);
      expect(newEntityClasses[0].fields[1].entity.mappedByFieldName).toEqual('mappedByFieldName1');
      expect(newEntityClasses[0].fields[1].entity.orphanRemoval).toBeTruthy();
      expect(newEntityClasses[0].fields[1].entity.association).toEqual('ONE_TO_ONE');
    });

    test('to many-to-one', () => {
      const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
      entityClass.fields[1].entity.association = 'ONE_TO_ONE';
      entityClass.fields[1].entity.orphanRemoval = true;
      const originalEntityClass = structuredClone(entityClass);
      handleFieldEntityAssociationChange('ONE_TO_MANY', entityClass, setEntityClass, 1);
      expect(entityClass).toEqual(originalEntityClass);
      expect(newEntityClasses).toHaveLength(1);
      expect(newEntityClasses[0].fields[1].entity.mappedByFieldName).toEqual('mappedByFieldName1');
      expect(newEntityClasses[0].fields[1].entity.orphanRemoval).toBeTruthy();
      expect(newEntityClasses[0].fields[1].entity.association).toEqual('ONE_TO_MANY');
    });
  });
});

describe('handleFieldEntityCascadeTypeChange', () => {
  test('add', () => {
    const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
    const originalEntityClass = structuredClone(entityClass);
    handleFieldEntityCascadeTypeChange(true, 'REFRESH', entityClass, setEntityClass, 1);
    expect(entityClass).toEqual(originalEntityClass);
    expect(newEntityClasses).toHaveLength(1);
    expect(newEntityClasses[0].fields[1].entity.cascadeTypes).toEqual(['PERSIST', 'MERGE', 'REFRESH']);
  });

  test('remove', () => {
    const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
    const originalEntityClass = structuredClone(entityClass);
    handleFieldEntityCascadeTypeChange(false, 'PERSIST', entityClass, setEntityClass, 1);
    expect(entityClass).toEqual(originalEntityClass);
    expect(newEntityClasses).toHaveLength(1);
    expect(newEntityClasses[0].fields[1].entity.cascadeTypes).toEqual(['MERGE']);
  });

  test('add ALL', () => {
    const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
    const originalEntityClass = structuredClone(entityClass);
    handleFieldEntityCascadeTypeChange(true, 'ALL', entityClass, setEntityClass, 1);
    expect(entityClass).toEqual(originalEntityClass);
    expect(newEntityClasses).toHaveLength(1);
    expect(newEntityClasses[0].fields[1].entity.cascadeTypes).toEqual(['ALL']);
  });

  test('remove ALL', () => {
    const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
    entityClass.fields[1].entity.cascadeTypes = ['ALL'];
    const originalEntityClass = structuredClone(entityClass);
    handleFieldEntityCascadeTypeChange(false, 'ALL', entityClass, setEntityClass, 1);
    expect(entityClass).toEqual(originalEntityClass);
    expect(newEntityClasses).toHaveLength(1);
    expect(newEntityClasses[0].fields[1].entity.cascadeTypes).toEqual([]);
  });

  test('add last', () => {
    const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
    entityClass.fields[1].entity.cascadeTypes = ['PERSIST', 'MERGE', 'REFRESH'];
    const originalEntityClass = structuredClone(entityClass);
    handleFieldEntityCascadeTypeChange(true, 'REMOVE', entityClass, setEntityClass, 1);
    expect(entityClass).toEqual(originalEntityClass);
    expect(newEntityClasses).toHaveLength(1);
    expect(newEntityClasses[0].fields[1].entity.cascadeTypes).toEqual(['ALL']);
  });

  test('remove first', () => {
    const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
    entityClass.fields[1].entity.cascadeTypes = ['ALL'];
    const originalEntityClass = structuredClone(entityClass);
    handleFieldEntityCascadeTypeChange(false, 'MERGE', entityClass, setEntityClass, 1);
    expect(entityClass).toEqual(originalEntityClass);
    expect(newEntityClasses).toHaveLength(1);
    expect(newEntityClasses[0].fields[1].entity.cascadeTypes).toEqual(['PERSIST', 'REMOVE', 'REFRESH']);
  });
});

test('handleFieldEntityMappedByFieldNameChange', () => {
  const { newEntityClasses, entityClass, setEntityClass } = setupEntityClass();
  entityClass.fields[1].modifiers = ['PERSISTENT', 'NOT_NULLABLE', 'UNIQUE', 'NOT_UPDATEABLE', 'NOT_INSERTABLE'];
  const originalEntityClass = structuredClone(entityClass);

  handleFieldEntityMappedByFieldNameChange('New Mapped By Field Name', entityClass, setEntityClass, 1);
  expect(entityClass).toEqual(originalEntityClass);
  expect(newEntityClasses).toHaveLength(1);
  expect(newEntityClasses[0].fields[1].entity.mappedByFieldName).toEqual('New Mapped By Field Name');
  expect(newEntityClasses[0].fields[1].modifiers).toEqual(['PERSISTENT', 'NOT_NULLABLE', 'UNIQUE', 'NOT_UPDATEABLE', 'NOT_INSERTABLE']);

  handleFieldEntityMappedByFieldNameChange('', entityClass, setEntityClass, 1);
  expect(entityClass).toEqual(originalEntityClass);
  expect(newEntityClasses).toHaveLength(2);
  expect(newEntityClasses[1].fields[1].entity.mappedByFieldName).toEqual('');
  expect(newEntityClasses[1].fields[1].modifiers).toEqual(['PERSISTENT']);
});
