import type { DataClassField } from '../data/dataclass';
import type { ValidationMessage } from '../protocol/types';
import { rowClassName, validationMessagesOfRow } from './ValidationRow';

test('validationMessagesOfRow', () => {
  const message0 = { path: 'field0' };
  const message1 = { path: 'field1' };
  const message2 = { path: 'field1' };
  const message3 = { path: 'field2' };
  const messages = [message0, message1, message2, message3] as Array<ValidationMessage>;

  expect(validationMessagesOfRow(messages, { name: 'field0' } as DataClassField)).toEqual([message0]);
  expect(validationMessagesOfRow(messages, { name: 'field1' } as DataClassField)).toEqual([message1, message2]);
  expect(validationMessagesOfRow(messages, { name: 'field2' } as DataClassField)).toEqual([message3]);
});

test('rowClassName', () => {
  expect(rowClassName([{ severity: 'INFO' }, { severity: 'INFO' }, { severity: 'INFO' }] as Array<ValidationMessage>)).toBeUndefined();
  expect(rowClassName([{ severity: 'INFO' }, { severity: 'WARNING' }, { severity: 'WARNING' }] as Array<ValidationMessage>)).toEqual(
    'row-warning'
  );
  expect(rowClassName([{ severity: 'INFO' }, { severity: 'WARNING' }, { severity: 'ERROR' }] as Array<ValidationMessage>)).toEqual(
    'row-error'
  );
});
