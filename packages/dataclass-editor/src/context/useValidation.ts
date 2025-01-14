import type { ValidationResult } from '@axonivy/dataclass-editor-protocol';
import { useAppContext } from './AppContext';

export const useValidation = (field?: number): Array<ValidationResult> => {
  const { dataClass, validations } = useAppContext();
  const fieldName = field === undefined ? undefined : dataClass.fields[field].name;
  return validations.filter(val => name(val) === fieldName);
};

const name = (validation: ValidationResult) => {
  if (validation.path === undefined) {
    return undefined;
  }
  return validation.path.substring(0, validation.path.lastIndexOf('.'));
};
