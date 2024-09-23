import type { DataClass, DataClassEntity, DataClassField, DataClassFieldEntity } from '../dataclass';

export const setupDataClass = () => {
  const dataClass: DataClass = {
    $schema: '$schema',
    simpleName: 'simpleName',
    namespace: 'namespace',
    comment: 'comment',
    annotations: ['annotation0', 'annotation1'],
    isBusinessCaseData: false,
    fields: [
      {
        name: 'name0',
        type: 'type0',
        comment: 'comment0',
        modifiers: ['PERSISTENT'],
        annotations: ['annotation00', 'annotation01']
      },
      {
        name: 'name1',
        type: 'type1',
        comment: 'comment1',
        modifiers: ['PERSISTENT'],
        annotations: ['annotation10', 'annotation11']
      },
      {
        name: 'name2',
        type: 'type2',
        comment: 'comment2',
        modifiers: ['PERSISTENT'],
        annotations: ['annotation20', 'annotation21']
      }
    ]
  };
  const newDataClasses: Array<DataClass> = [];
  const setDataClass = (newDataClass: DataClass) => newDataClasses.push(newDataClass);
  return { newDataClasses, dataClass, setDataClass };
};

export const setupBusinessDataClass = () => {
  const setup = setupDataClass();
  setup.dataClass.isBusinessCaseData = true;
  return setup;
};

export const setupEntityClass = () => {
  const { dataClass } = setupDataClass();
  const entityClass: DataClass & { entity: DataClassEntity; fields: Array<DataClassField & { entity: DataClassFieldEntity }> } = {
    ...dataClass,
    entity: {
      tableName: 'tableName'
    },
    fields: dataClass.fields as Array<DataClassField & { entity: DataClassFieldEntity }>
  };
  for (let i = 0; i < entityClass.fields.length; i++) {
    entityClass.fields[i].entity = {
      databaseName: `databaseName${i}`,
      databaseFieldLength: `databaseFieldLength${i}`,
      cascadeTypes: ['PERSIST', 'MERGE'],
      mappedByFieldName: `mappedByFieldName${i}`,
      orphanRemoval: false
    };
  }
  const newEntityClasses: Array<DataClass & { entity: DataClassEntity; fields: Array<DataClassField & { entity: DataClassFieldEntity }> }> =
    [];
  const setEntityClass = (newEntityClass: DataClass) =>
    newEntityClasses.push(
      newEntityClass as DataClass & { entity: DataClassEntity; fields: Array<DataClassField & { entity: DataClassFieldEntity }> }
    );
  return { newEntityClasses, entityClass, setEntityClass };
};
