import type { ValidationResult } from '@axonivy/dataclass-editor-protocol';
import { useAppContext } from './AppContext';

export const useValidation = (name?: string): Array<ValidationResult> => {
  const { validations } = useAppContext();
  return validations.filter(val => pathName(val) === name);
};

const pathName = (validation: ValidationResult) => {
  if (validation.path === undefined) {
    return undefined;
  }
  const lastDotIndex = validation.path.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return validation.path.substring(0, lastDotIndex);
  }
  return validation.path;
};
