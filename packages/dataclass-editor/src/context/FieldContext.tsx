import { createContext, useContext } from 'react';
import type { Field, EntityClassField } from '@axonivy/dataclass-editor-protocol';

type FieldContext = {
  field: Field;
  setField: (field: Field) => void;
};

const fieldContext = createContext<FieldContext>({
  field: {} as Field,
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
