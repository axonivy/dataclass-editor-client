import { areArraysIdentical } from '../../../utils/array/array';
import {
  dataClassFieldEntityCascadeTypes,
  dataClassIDTypes,
  dataClassVersionTypes,
  type DataClass,
  type DataClassEntity,
  type DataClassField,
  type DataClassFieldEntity,
  type DataClassFieldEntityAssociation,
  type DataClassFieldEntityCascadeType,
  type DataClassFieldModifier
} from './dataclass';

export const classTypeOf = (dataClass: DataClass) => {
  if (dataClass.entity) {
    return 'ENTITY';
  }
  if (dataClass.isBusinessCaseData) {
    return 'BUSINESS_DATA';
  }
  return 'DATA';
};

export const isEntity = (
  dataClass: DataClass
): dataClass is DataClass & { entity: DataClassEntity; fields: Array<DataClassField & { entity: DataClassFieldEntity }> } => {
  return !!dataClass.entity;
};

export const isEntityField = (field: DataClassField): field is DataClassField & { entity: DataClassFieldEntity } => {
  return !!field.entity;
};

export const headerTitles = (dataClass: DataClass, selectedField?: number) => {
  let baseTitle = '';
  switch (classTypeOf(dataClass)) {
    case 'DATA':
      baseTitle = 'Data';
      break;
    case 'BUSINESS_DATA':
      baseTitle = 'Business Data';
      break;
    case 'ENTITY':
      baseTitle = 'Entity';
  }
  const masterTitle = `${baseTitle} Editor`;

  const dataClassFields = dataClass.fields;

  let detailTitle = '';
  if (selectedField === undefined) {
    detailTitle = `${baseTitle} - ${dataClass.simpleName}`;
  } else if (selectedField < dataClassFields.length) {
    const selectedDataClassField = dataClassFields[selectedField];
    detailTitle = 'Attribute - ' + selectedDataClassField.name;
  }
  return { masterTitle, detailTitle };
};

export const className = (qualifiedName: string) => {
  const lastDotIndex = qualifiedName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return qualifiedName;
  }
  return qualifiedName.substring(lastDotIndex + 1);
};

export const handleDataClassPropertyChange = <DKey extends keyof DataClass>(
  key: DKey,
  value: DataClass[DKey],
  dataClass: DataClass,
  setDataClass: (newDataClass: DataClass) => void
) => {
  const newDataClass = structuredClone(dataClass);
  newDataClass[key] = value;
  setDataClass(newDataClass);
};

export const handleDataClassEntityPropertyChange = <DEKey extends keyof DataClassEntity>(
  key: DEKey,
  value: DataClassEntity[DEKey],
  dataClass: DataClass & { entity: DataClassEntity },
  setDataClass: (newDataClass: DataClass) => void
) => {
  const newEntity = structuredClone(dataClass.entity);
  newEntity[key] = value;
  handleDataClassPropertyChange('entity', newEntity, dataClass, setDataClass);
};

export const handleClassTypeChange = (classType: string, dataClass: DataClass, setDataClass: (newDataClass: DataClass) => void) => {
  const newDataClass = structuredClone(dataClass);

  newDataClass.isBusinessCaseData = false;
  newDataClass.entity = undefined;
  newDataClass.fields.forEach(field => {
    field.modifiers = field.modifiers.filter(modifier => modifier === 'PERSISTENT');
    field.entity = undefined;
  });

  if (classType === 'BUSINESS_DATA') {
    newDataClass.isBusinessCaseData = true;
  } else if (classType === 'ENTITY') {
    newDataClass.entity = { tableName: '' };
    newDataClass.fields.forEach(
      field =>
        (field.entity = {
          databaseName: '',
          databaseFieldLength: '',
          cascadeTypes: [],
          mappedByFieldName: '',
          orphanRemoval: false
        })
    );
  }

  setDataClass(newDataClass);
};

export const handleFieldPropertyChange = <FKey extends keyof DataClassField>(
  key: FKey,
  value: DataClassField[FKey],
  dataClass: DataClass,
  setDataClass: (newDataClass: DataClass) => void,
  selectedField: number
) => {
  const newDataClass = structuredClone(dataClass);
  newDataClass.fields[selectedField][key] = value;
  setDataClass(newDataClass);
};

export const handleFieldTypeChange = (
  type: string,
  dataClass: DataClass,
  setDataClass: (newDataClass: DataClass) => void,
  selectedField: number
) => {
  const newDataClass = structuredClone(dataClass);
  const newField = newDataClass.fields[selectedField];
  if (!dataClassIDTypes.includes(type)) {
    newField.modifiers = updateModifiers(false, newField.modifiers, 'ID');
  }
  if (!dataClassVersionTypes.includes(type)) {
    newField.modifiers = updateModifiers(false, newField.modifiers, 'VERSION');
  }
  newField.type = type;
  setDataClass(newDataClass);
};

export const handleFieldModifierChange = (
  add: boolean | string,
  modifier: DataClassFieldModifier,
  dataClass: DataClass,
  setDataClass: (newDataClass: DataClass) => void,
  selectedField: number
) => {
  let newModifiers = structuredClone(dataClass.fields[selectedField].modifiers);
  newModifiers = updateModifiers(add, newModifiers, modifier);
  handleFieldPropertyChange('modifiers', newModifiers, dataClass, setDataClass, selectedField);
};

const updateModifiers = (add: boolean | string, newModifiers: Array<DataClassFieldModifier>, modifier: DataClassFieldModifier) => {
  if (add) {
    if (modifier === 'ID') {
      newModifiers = newModifiers.filter(mod => mod === 'GENERATED' || mod === 'PERSISTENT');
    }
    newModifiers.push(modifier);
  } else {
    if (modifier === 'ID') {
      newModifiers = newModifiers.filter(mod => mod !== 'GENERATED');
    }
    newModifiers = newModifiers.filter(mod => mod !== modifier);
  }
  return newModifiers;
};

export const handleFieldEntityPropertyChange = <FEKey extends keyof DataClassFieldEntity>(
  key: FEKey,
  value: DataClassFieldEntity[FEKey],
  dataClass: DataClass & { fields: Array<DataClassField & { entity: DataClassFieldEntity }> },
  setDataClass: (newDataClass: DataClass) => void,
  selectedField: number
) => {
  const newEntity = structuredClone(dataClass.fields[selectedField].entity);
  newEntity[key] = value;
  handleFieldPropertyChange('entity', newEntity, dataClass, setDataClass, selectedField);
};

export const handleFieldEntityAssociationChange = (
  association: DataClassFieldEntityAssociation | undefined,
  dataClass: DataClass & { fields: Array<DataClassField & { entity: DataClassFieldEntity }> },
  setDataClass: (newDataClass: DataClass) => void,
  selectedField: number
) => {
  const newDataClass = structuredClone(dataClass);
  const newEntity = newDataClass.fields[selectedField].entity;
  if (!association || association === 'MANY_TO_ONE') {
    newEntity.mappedByFieldName = '';
    newEntity.orphanRemoval = false;
  }
  newEntity.association = association;
  setDataClass(newDataClass);
};

export const handleFieldEntityCascadeTypeChange = (
  add: boolean | string,
  cascadeType: DataClassFieldEntityCascadeType,
  dataClass: DataClass & { fields: Array<DataClassField & { entity: DataClassFieldEntity }> },
  setDataClass: (newDataClass: DataClass) => void,
  selectedField: number
) => {
  if (cascadeType === 'ALL') {
    const newCascadeTypes: Array<DataClassFieldEntityCascadeType> = [];
    if (add) {
      newCascadeTypes.push('ALL');
    }
    handleFieldEntityPropertyChange('cascadeTypes', newCascadeTypes, dataClass, setDataClass, selectedField);
    return;
  }

  const allCascadeTypes = [...dataClassFieldEntityCascadeTypes];

  const newDataClass = structuredClone(dataClass);
  const newFieldEntity = newDataClass.fields[selectedField].entity;
  let newCascadeTypes = newFieldEntity.cascadeTypes;
  if (add) {
    newCascadeTypes.push(cascadeType);
    if (areArraysIdentical(newCascadeTypes, allCascadeTypes)) {
      newCascadeTypes = ['ALL'];
    }
  } else {
    if (newCascadeTypes.includes('ALL')) {
      newCascadeTypes = allCascadeTypes;
    }
    newCascadeTypes.splice(newCascadeTypes.indexOf(cascadeType), 1);
  }
  newFieldEntity.cascadeTypes = newCascadeTypes;
  setDataClass(newDataClass);
};

export const handleFieldEntityMappedByFieldNameChange = (
  mappedByFieldName: string,
  dataClass: DataClass & { fields: Array<DataClassField & { entity: DataClassFieldEntity }> },
  setDataClass: (newDataClass: DataClass) => void,
  selectedField: number
) => {
  const newDataClass = structuredClone(dataClass);
  const newField = newDataClass.fields[selectedField];
  if (mappedByFieldName === '') {
    newField.modifiers = newField.modifiers.filter(modifier => modifier === 'PERSISTENT');
  }
  newField.entity.mappedByFieldName = mappedByFieldName;
  setDataClass(newDataClass);
};
