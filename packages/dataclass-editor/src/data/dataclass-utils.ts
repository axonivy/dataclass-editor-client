import { type DataClass, type Modifier, type DataClassType, type EntityDataClass } from '@axonivy/dataclass-editor-protocol';

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
