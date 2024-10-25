import type { MessageData } from '@axonivy/ui-components';
import { useAppContext } from '../context/AppContext';
import type { DataClassField } from '@axonivy/dataclass-editor-protocol';

export const useValidation = (field?: DataClassField): Array<MessageData> => {
  const { validationMessages } = useAppContext();
  return validationMessages
    .filter(message => message.path === field?.name)
    .map(message => ({ message: message.message, variant: message.severity.toLowerCase() }));
};
