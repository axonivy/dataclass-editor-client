import { type DataClass, type DataClassFieldModifier, type DataClassType, type EntityClass } from '@axonivy/dataclass-editor-protocol';

export const classTypeOf = (dataClass: DataClass): DataClassType => {
  if (dataClass.entity) {
    return 'ENTITY';
  }
  if (dataClass.isBusinessCaseData) {
    return 'BUSINESS_DATA';
  }
  return 'DATA';
};

export const isEntity = (dataClass: DataClass): dataClass is EntityClass => {
  return !!dataClass.entity;
};

export const updateModifiers = (add: boolean, newModifiers: Array<DataClassFieldModifier>, modifier: DataClassFieldModifier) => {
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
