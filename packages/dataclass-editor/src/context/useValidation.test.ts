import type { DataClass, ValidationResult } from '@axonivy/dataclass-editor-protocol';
import { customRenderHook } from './test-utils/test-utils';
import { useValidation } from './useValidation';

test('useValidation', () => {
  expect(renderValidationHook().result.current).toEqual([validations[1], validations[2], validations[4]]);
  expect(renderValidationHook(0).result.current).toEqual([validations[0], validations[5]]);
  expect(renderValidationHook(1).result.current).toEqual([validations[3]]);
});

const renderValidationHook = (field?: number) => {
  return customRenderHook(() => useValidation(field), {
    wrapperProps: { appContext: { dataClass: { fields: [{ name: 'field0' }, { name: 'field1' }] } as DataClass, validations } }
  });
};

const validations = [
  { message: 'message0', path: 'field0.property' },
  { message: 'message1' },
  { message: 'message2' },
  { message: 'message3', path: 'field1.property' },
  { message: 'message4' },
  { message: 'message5', path: 'field0.property' }
] as Array<ValidationResult>;
