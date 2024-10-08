import { useEntityField } from '../../../context/FieldContext';
import type { DataClassFieldEntity } from '../../../data/dataclass';

export const useFieldEntityProperty = () => {
  const { field, setField } = useEntityField();
  const setProperty = <FEKey extends keyof DataClassFieldEntity>(key: FEKey, value: DataClassFieldEntity[FEKey]) => {
    const newField = structuredClone(field);
    newField.entity[key] = value;
    setField(newField);
  };
  return { field, setProperty };
};
