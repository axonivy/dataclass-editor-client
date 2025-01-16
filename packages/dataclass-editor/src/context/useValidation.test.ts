import type { Field, ValidationResult } from '@axonivy/dataclass-editor-protocol';
import { customRenderHook } from './test-utils/test-utils';
import { useValidation } from './useValidation';

test('useValidation', () => {
  expect(renderValidationHook().result.current).toEqual([validations[1], validations[2], validations[4]]);
  expect(renderValidationHook({ name: 'field0' } as Field).result.current).toEqual([validations[0], validations[5]]);
  expect(renderValidationHook({ name: 'field1' } as Field).result.current).toEqual([validations[3]]);
});

const renderValidationHook = (field?: Field) => {
  return customRenderHook(() => useValidation(field), { wrapperProps: { appContext: { validations } } });
};

const validations = [
  { message: 'message0', path: 'field0.property' },
  { message: 'message1' },
  { message: 'message2' },
  { message: 'message3', path: 'field1.property' },
  { message: 'message4' },
  { message: 'message5', path: 'field0.property' }
] as Array<ValidationResult>;
