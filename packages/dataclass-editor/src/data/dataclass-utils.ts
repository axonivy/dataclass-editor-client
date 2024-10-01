import { type DataClass, type DataClassType, type EntityClass } from './dataclass';

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
