import type { EntityClassField, Field } from '@axonivy/dataclass-editor-protocol';
import type { MessageData } from '@axonivy/ui-components';
import { createContext, useContext } from 'react';

type FieldContext = {
  field: Field;
  setField: (field: Field) => void;
  messages: Record<string, MessageData>;
};

const fieldContext = createContext<FieldContext>({
  field: {} as Field,
  setField: () => {},
  messages: {}
});

export const FieldProvider = fieldContext.Provider;

export const useField = () => {
  return useContext(fieldContext);
};

type EntityFieldContext = {
  field: EntityClassField;
  setField: (field: EntityClassField) => void;
  messages: Record<string, MessageData>;
};

const entityFieldContext = createContext<EntityFieldContext>({
  field: {} as EntityClassField,
  setField: () => {},
  messages: {}
});

export const EntityFieldProvider = entityFieldContext.Provider;

export const useEntityField = () => {
  return useContext(entityFieldContext);
};
