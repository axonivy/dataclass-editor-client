import { customRenderHook } from '../context/test-utils/test-utils';
import type { Field, ValidationResult } from '@axonivy/dataclass-editor-protocol';
import { useValidation } from './useValidation';

describe('useValidation', () => {
  test('class', () => {
    const view = customRenderHook(() => useValidation(), {
      wrapperProps: {
        appContext: {
          validationMessages: [
            { message: 'message0', path: 'field0', severity: 'INFO' },
            { message: 'message1', severity: 'INFO' },
            { message: 'message2', severity: 'WARNING' },
            { message: 'message3', path: 'field1', severity: 'INFO' },
            { message: 'message4', severity: 'ERROR' }
          ] as Array<ValidationResult>
        }
      }
    });

    expect(view.result.current).toEqual([
      { message: 'message1', variant: 'info' },
      { message: 'message2', variant: 'warning' },
      { message: 'message4', variant: 'error' }
    ]);
  });

  test('field', () => {
    const renderValidationHook = (fieldName: string) => {
      return customRenderHook(() => useValidation({ name: fieldName } as Field), {
        wrapperProps: {
          appContext: {
            validationMessages: [
              { message: 'message0', path: 'field1', severity: 'INFO' },
              { message: 'message1', path: 'field0', severity: 'INFO' },
              { message: 'message2', path: 'field1', severity: 'WARNING' },
              { message: 'message3', path: 'field1', severity: 'ERROR' },
              { message: 'message4', path: 'field2', severity: 'INFO' }
            ] as Array<ValidationResult>
          }
        }
      });
    };

    expect(renderValidationHook('field0').result.current).toEqual([{ message: 'message1', variant: 'info' }]);
    expect(renderValidationHook('field1').result.current).toEqual([
      { message: 'message0', variant: 'info' },
      { message: 'message2', variant: 'warning' },
      { message: 'message3', variant: 'error' }
    ]);
    expect(renderValidationHook('field2').result.current).toEqual([{ message: 'message4', variant: 'info' }]);
  });
});
