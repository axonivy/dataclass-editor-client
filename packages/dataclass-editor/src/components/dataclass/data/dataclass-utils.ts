import type { DataClass } from './dataclass';

export const classType = (dataClass: DataClass) => {
  if (dataClass.entity) {
    return 'ENTITY';
  }
  if (dataClass.isBusinessCaseData) {
    return 'BUSINESS_DATA';
  }
  return 'DATA';
};

export const className = (qualifiedName: string) => {
  const lastDotIndex = qualifiedName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return qualifiedName;
  }
  return qualifiedName.substring(lastDotIndex + 1);
};
