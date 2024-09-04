import type { DataClass } from './dataclass';

export const isEntityClass = (dataClass: DataClass) => {
  return !!dataClass.entity;
};

export const newFieldName = (dataClass: DataClass) => {
  const takenNames = dataClass.fields.map(field => field.name);
  const baseName = 'newAttribute';
  let newName = baseName;
  let index = 2;
  while (takenNames.includes(newName)) {
    newName = `${baseName}${index}`;
    index++;
  }
  return newName;
};
