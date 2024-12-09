import {
  type Association,
  type DataClass,
  type DataClassType,
  type EntityClassField,
  type EntityDataClass,
  type Field,
  type Modifier
} from '@axonivy/dataclass-editor-protocol';

export const classTypeOf = (dataClass: DataClass): DataClassType => {
  if (dataClass.entity) {
    return 'ENTITY';
  }
  if (dataClass.isBusinessCaseData) {
    return 'BUSINESS_DATA';
  }
  return 'DATA';
};

export const isEntity = (dataClass: DataClass): dataClass is EntityDataClass => {
  return !!dataClass.entity;
};

export const isEntityField = (field: Field): field is EntityClassField => {
  return !!field.entity && field.modifiers.includes('PERSISTENT');
};

export const updateModifiers = (add: boolean, newModifiers: Array<Modifier>, modifier: Modifier) => {
  if (add) {
    if (modifier === 'ID' || modifier === 'VERSION') {
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

export const updateCardinality = (newField: EntityClassField, association?: Association) => {
  newField.entity.mappedByFieldName = '';
  newField.entity.orphanRemoval = false;
  newField.entity.association = association;
};
