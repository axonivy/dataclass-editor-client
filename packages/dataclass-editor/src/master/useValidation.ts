import type { MessageData } from '@axonivy/ui-components';
import { useAppContext } from '../context/AppContext';
import type { Field, Severity } from '@axonivy/dataclass-editor-protocol';

export const useValidation = (field?: Field): Array<MessageData> => {
  const { validationMessages } = useAppContext();
  return validationMessages
    .filter(message => message.path === field?.name)
    .map(message => ({ message: message.message, variant: message.severity.toLowerCase() as Lowercase<Severity> }));
};
