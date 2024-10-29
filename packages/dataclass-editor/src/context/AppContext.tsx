import { createContext, useContext } from 'react';
import type { DataClass, EntityDataClass,  DataContext, ValidationMessage } from '@axonivy/dataclass-editor-protocol';

type AppContext = {
  context: DataContext;
  dataClass: DataClass;
  setDataClass: (dataClass: DataClass) => void;
  selectedField?: number;
  setSelectedField: (index?: number) => void;
  detail: boolean;
  setDetail: (visible: boolean) => void;
  validationMessages: Array<ValidationMessage>;
};

const appContext = createContext<AppContext>({
  context: { app: '', pmv: '', file: '' },
  dataClass: {} as DataClass,
  setDataClass: () => {},
  selectedField: undefined,
  setSelectedField: () => {},
  detail: true,
  setDetail: () => {},
  validationMessages: []
});

export const AppProvider = appContext.Provider;

export const useAppContext = () => {
  return useContext(appContext);
};

type EntityClassContext = {
  entityClass: EntityDataClass;
  setEntityClass: (entityClass: EntityDataClass) => void;
};

const entityClassContext = createContext<EntityClassContext>({
  entityClass: {} as EntityDataClass,
  setEntityClass: () => {}
});

export const EntityClassProvider = entityClassContext.Provider;

export const useEntityClass = () => {
  return useContext(entityClassContext);
};
