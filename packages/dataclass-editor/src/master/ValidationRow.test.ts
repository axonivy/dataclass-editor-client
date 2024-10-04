import type { ValidationMessage } from '../protocol/types';
import { rowClassName } from './ValidationRow';

test('rowClassName', () => {
  expect(rowClassName([{ severity: 'INFO' }, { severity: 'INFO' }, { severity: 'INFO' }] as Array<ValidationMessage>)).toBeUndefined();
  expect(rowClassName([{ severity: 'INFO' }, { severity: 'WARNING' }, { severity: 'WARNING' }] as Array<ValidationMessage>)).toEqual(
    'row-warning'
  );
  expect(rowClassName([{ severity: 'INFO' }, { severity: 'WARNING' }, { severity: 'ERROR' }] as Array<ValidationMessage>)).toEqual(
    'row-error'
  );
});
