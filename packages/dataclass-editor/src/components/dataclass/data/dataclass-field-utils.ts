import { DataClassFieldModifier, type DataClassField } from './dataclass';

export const isPersistent = (dataClassField: DataClassField) => {
  if (!dataClassField.modifiers) {
    return false;
  }
  return dataClassField.modifiers.includes(DataClassFieldModifier.PERSISTENT);
};
