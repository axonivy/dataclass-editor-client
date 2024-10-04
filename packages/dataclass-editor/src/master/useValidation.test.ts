import { customRenderHook } from '../context/test-utils/test-utils';
import type { DataClassField } from '../data/dataclass';
import type { ValidationMessage } from '../protocol/types';
import { useValidation } from './useValidation';

test('validationMessagesOfRow', () => {
  const message0 = { path: 'field0' };
  const message1 = { path: 'field1' };
  const message2 = { path: 'field1' };
  const message3 = { path: 'field2' };

  const renderValidationHook = (fieldName: string) => {
    return customRenderHook(() => useValidation({ name: fieldName } as DataClassField), {
      wrapperProps: { appContext: { validationMessages: [message0, message1, message2, message3] as Array<ValidationMessage> } }
    });
  };

  expect(renderValidationHook('field0').result.current).toEqual([message0]);
  expect(renderValidationHook('field1').result.current).toEqual([message1, message2]);
  expect(renderValidationHook('field2').result.current).toEqual([message3]);
});
