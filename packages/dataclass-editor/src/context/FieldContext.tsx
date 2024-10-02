import { createContext, useContext } from 'react';
import type { DataClassField, EntityClassField } from '../data/dataclass';

type FieldContext = {
  field: DataClassField;
  setField: (field: DataClassField) => void;
};

const fieldContext = createContext<FieldContext>({
  field: {} as DataClassField,
  setField: () => {}
});

export const FieldProvider = fieldContext.Provider;

export const useField = () => {
  return useContext(fieldContext);
};

type EntityFieldContext = {
  field: EntityClassField;
  setField: (field: EntityClassField) => void;
};

const entityFieldContext = createContext<EntityFieldContext>({
  field: {} as EntityClassField,
  setField: () => {}
});

export const EntityFieldProvider = entityFieldContext.Provider;

export const useEntityField = () => {
  return useContext(entityFieldContext);
};
