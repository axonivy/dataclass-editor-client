import type { DataClass } from './dataclass';

export const isEntityClass = (dataClass: DataClass) => {
  return !!dataClass.entity;
};
