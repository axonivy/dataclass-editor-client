import { createContext, useContext } from 'react';
import type { DataClassField } from '../components/dataclass/data/dataclass';

type FieldContext = {
  field: DataClassField;
  selectedField: number;
};

const fieldContext = createContext<FieldContext>({
  field: {} as DataClassField,
  selectedField: 0
});

export const FieldProvider = fieldContext.Provider;

export const useFieldContext = () => {
  return useContext(fieldContext);
};
