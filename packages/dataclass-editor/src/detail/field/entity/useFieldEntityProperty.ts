import { useEntityField } from '../../../context/DetailContext';
import type { EntityField } from '@axonivy/dataclass-editor-protocol';

export const useFieldEntityProperty = () => {
  const { field, setField } = useEntityField();
  const setProperty = <FEKey extends keyof EntityField>(key: FEKey, value: EntityField[FEKey]) => {
    const newField = structuredClone(field);
    newField.entity[key] = value;
    setField(newField);
  };
  return { field, setProperty };
};
