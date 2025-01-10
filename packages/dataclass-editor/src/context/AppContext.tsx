import { createContext, useContext } from 'react';
import type { DataClass, EntityDataClass, DataClassEditorDataContext, ValidationResult } from '@axonivy/dataclass-editor-protocol';
import type { UpdateConsumer } from '../utils/lambda/lambda';

export type AppContext = {
  context: DataClassEditorDataContext;
  dataClass: DataClass;
  setDataClass: UpdateConsumer<DataClass>;
  selectedField?: number;
  setSelectedField: (index?: number) => void;
  detail: boolean;
  setDetail: (visible: boolean) => void;
  validationMessages: Array<ValidationResult>;
};

const appContext = createContext<AppContext>({
  context: { app: '', pmv: '', file: '' },
  dataClass: {} as DataClass,
  setDataClass: data => data,
  selectedField: undefined,
  setSelectedField: () => {},
  detail: true,
  setDetail: () => {},
  validationMessages: []
});

export const AppProvider = appContext.Provider;

export const useAppContext = () => {
  const context = useContext(appContext);
  return { ...context, isHdData: context.context.file.includes('src_hd') };
};

export type EntityClassContext = {
  entityClass: EntityDataClass;
  setEntityClass: UpdateConsumer<EntityDataClass>;
};

const entityClassContext = createContext<EntityClassContext>({
  entityClass: {} as EntityDataClass,
  setEntityClass: data => data
});

export const EntityClassProvider = entityClassContext.Provider;

export const useEntityClass = () => {
  return useContext(entityClassContext);
};
