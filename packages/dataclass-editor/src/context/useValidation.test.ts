import type { ValidationResult } from '@axonivy/dataclass-editor-protocol';
import { customRenderHook } from './test-utils/test-utils';
import { useValidation } from './useValidation';

test('useValidation', () => {
  expect(renderValidationHook().result.current).toEqual([validations[2]]);
  expect(renderValidationHook('field0').result.current).toEqual([validations[0], validations[5]]);
  expect(renderValidationHook('field1').result.current).toEqual([validations[3]]);
  expect(renderValidationHook('#class').result.current).toEqual([validations[1], validations[4], validations[6]]);
});

const renderValidationHook = (name?: string) => {
  return customRenderHook(() => useValidation(name), { wrapperProps: { appContext: { validations } } });
};

const validations = [
  { message: 'message0', path: 'field0.property' },
  { message: 'message1', path: '#class' },
  { message: 'message2' },
  { message: 'message3', path: 'field1.property' },
  { message: 'message4', path: '#class' },
  { message: 'message5', path: 'field0.property' },
  { message: 'message6', path: '#class.property' }
] as Array<ValidationResult>;
