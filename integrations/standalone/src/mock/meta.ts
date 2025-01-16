import type { FieldContext, MappedByFieldsContext } from '@axonivy/dataclass-editor-protocol';

export const cardinalities = (context: FieldContext) => {
  if (context.field.startsWith('entity') || context.field.startsWith('invalidField')) {
    return ['ONE_TO_ONE', 'MANY_TO_ONE'];
  }
  if (context.field.startsWith('entities')) {
    return ['ONE_TO_MANY'];
  }
  return [];
};

export const mappedByFields = (context: MappedByFieldsContext) => {
  if (context.cardinality === 'ONE_TO_ONE') {
    return ['MappedByFieldName'];
  }
  return [];
};
