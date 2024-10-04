import { useAppContext } from '../context/AppContext';
import type { DataClassField } from '../data/dataclass';

export const useValidation = (field: DataClassField) => {
  const { validationMessages } = useAppContext();
  return validationMessages.filter(message => message.path === field.name);
};
