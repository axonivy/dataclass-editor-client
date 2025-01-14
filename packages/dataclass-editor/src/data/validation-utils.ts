import type { Severity, ValidationResult } from '@axonivy/dataclass-editor-protocol';
import type { MessageData } from '@axonivy/ui-components';

export const messagesByProperty = (validations: Array<ValidationResult>) => {
  const validationsByProperty = validations.reduce<Record<string, Array<ValidationResult>>>((validationsByProperty, validation) => {
    const property = validationProperty(validation);
    if (!validationsByProperty[property]) {
      validationsByProperty[property] = [];
    }
    validationsByProperty[property].push(validation);
    return validationsByProperty;
  }, {});

  const messageDataByProperty: Record<string, MessageData> = {};
  Object.entries(validationsByProperty).forEach(([property, validations]) => {
    messageDataByProperty[property] = messageData(validations);
  });
  return messageDataByProperty;
};

const validationProperty = (validation: ValidationResult) => {
  return validation.path.substring(validation.path.lastIndexOf('.') + 1);
};

const messageData = (validations: Array<ValidationResult>) => {
  const validationError = validations.find(val => val.severity === 'ERROR');
  if (validationError) {
    return toMessageData(validationError);
  }
  const validationWarning = validations.find(val => val.severity === 'WARNING');
  if (validationWarning) {
    return toMessageData(validationWarning);
  }
  const validationOther = validations[0];
  return toMessageData(validationOther);
};

export const toMessageData = (validation: ValidationResult) => {
  return { message: validation.message, variant: variant(validation) };
};

export const variant = (validation: ValidationResult): Lowercase<Severity> => {
  return validation.severity.toLocaleLowerCase() as Lowercase<Severity>;
};

export const combineMessagesOfProperties = (messagesByProperty: Record<string, MessageData>, ...properties: Array<string>) => {
  return properties.reduce<Array<MessageData>>((messages, property) => {
    if (messagesByProperty[property]) {
      return messages.concat([messagesByProperty[property]]);
    }
    return messages;
  }, []);
};
