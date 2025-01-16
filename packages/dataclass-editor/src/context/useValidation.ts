import type { Field, ValidationResult } from '@axonivy/dataclass-editor-protocol';
import { useAppContext } from './AppContext';

export const useValidation = (field?: Field): Array<ValidationResult> => {
  const { validations } = useAppContext();
  return validations.filter(val => name(val) === field?.name);
};

const name = (validation: ValidationResult) => {
  if (validation.path === undefined) {
    return undefined;
  }
  return validation.path.substring(0, validation.path.lastIndexOf('.'));
};
