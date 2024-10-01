import { useAppContext } from '../context/AppContext';
import { useEntityField, useField } from '../context/FieldContext';
import { type DataClass, type DataClassField, type DataClassFieldEntity, type DataClassFieldModifier } from './dataclass';

export const useDataClassProperty = () => {
  const { dataClass, setDataClass } = useAppContext();
  const setProperty = <DKey extends keyof DataClass>(key: DKey, value: DataClass[DKey]) => {
    const newDataClass = structuredClone(dataClass);
    newDataClass[key] = value;
    setDataClass(newDataClass);
  };
  return setProperty;
};

export const useFieldProperty = () => {
  const { field, setField } = useField();
  const setProperty = <FKey extends keyof DataClassField>(key: FKey, value: DataClassField[FKey]) => {
    const newField = structuredClone(field);
    newField[key] = value;
    setField(newField);
  };
  return setProperty;
};

export const useFieldEntityProperty = () => {
  const { field, setField } = useEntityField();
  const setProperty = <FEKey extends keyof DataClassFieldEntity>(key: FEKey, value: DataClassFieldEntity[FEKey]) => {
    const newField = structuredClone(field);
    newField.entity[key] = value;
    setField(newField);
  };
  return setProperty;
};

export const updateModifiers = (add: boolean | string, newModifiers: Array<DataClassFieldModifier>, modifier: DataClassFieldModifier) => {
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
