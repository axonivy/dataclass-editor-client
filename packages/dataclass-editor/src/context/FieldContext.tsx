import { createContext, useContext } from 'react';
import type { DataClassField } from '../components/dataclass/data/dataclass';

type FieldContext = {
  field: DataClassField;
};

const fieldContext = createContext<FieldContext>({
  field: {} as DataClassField
});

export const FieldProvider = fieldContext.Provider;

export const useFieldContext = () => {
  return useContext(fieldContext);
};
