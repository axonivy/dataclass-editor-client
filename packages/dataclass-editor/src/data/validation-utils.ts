import type { MessageData } from '@axonivy/ui-components';
import type { DataClass } from './dataclass';

export const validateFieldName = (name: string, dataClass: DataClass): MessageData => {
  if (name.trim() === '') {
    return toErrorMessage('Name cannot be empty.');
  }
  if (dataClass.fields.map(field => field.name).includes(name)) {
    return toErrorMessage('Name is already taken.');
  }
};

export const validateFieldType = (type: string): MessageData => {
  if (type.trim() === '') {
    return toErrorMessage('Type cannot be empty.');
  }
};

const toErrorMessage = (message: string) => {
  return { message: message, variant: 'error' };
};
