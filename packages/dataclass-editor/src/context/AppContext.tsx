import { createContext, useContext } from 'react';
import type { DataClass } from '../components/dataclass/data/dataclass';

type AppContext = {
  dataClass: DataClass;
  selectedField?: number;
  setSelectedField: (index?: number) => void;
  detail: boolean;
  setDetail: (visible: boolean) => void;
};

const appContext = createContext<AppContext>({
  dataClass: {} as DataClass,
  selectedField: undefined,
  setSelectedField: () => {},
  detail: true,
  setDetail: () => {}
});

export const AppProvider = appContext.Provider;

export const useAppContext = () => {
  return useContext(appContext);
};
