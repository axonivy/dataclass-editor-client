import type { DataClass } from './dataclass';

export const isEntityClass = (dataClass: DataClass) => {
  return !!dataClass.entity;
};

export const className = (qualifiedName: string) => {
  const lastDotIndex = qualifiedName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return qualifiedName;
  }
  return qualifiedName.substring(lastDotIndex + 1);
};
