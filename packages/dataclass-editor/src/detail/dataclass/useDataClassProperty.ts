import { useAppContext } from '../../context/AppContext';
import type { DataClass } from '@axonivy/dataclass-editor-protocol';

export const useDataClassProperty = () => {
  const { dataClass, setDataClass } = useAppContext();
  const setProperty = <DKey extends keyof DataClass>(key: DKey, value: DataClass[DKey]) => {
    setDataClass(old => {
      old[key] = value;
      return old;
    });
  };
  return { dataClass, setProperty };
};
