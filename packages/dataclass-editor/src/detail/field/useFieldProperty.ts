import { useField } from '../../context/FieldContext';
import type { DataClassField } from '@axonivy/dataclass-editor-protocol';

export const useFieldProperty = () => {
  const { field, setField } = useField();
  const setProperty = <FKey extends keyof DataClassField>(key: FKey, value: DataClassField[FKey]) => {
    const newField = structuredClone(field);
    newField[key] = value;
    setField(newField);
  };
  return { field, setProperty };
};
