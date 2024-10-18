import { rowClassName } from './ValidationRow';

test('rowClassName', () => {
  expect(rowClassName([{ variant: 'info' }, { variant: 'info' }, { variant: 'info' }])).toBeUndefined();
  expect(rowClassName([{ variant: 'info' }, { variant: 'warning' }, { variant: 'warning' }])).toEqual('row-warning');
  expect(rowClassName([{ variant: 'info' }, { variant: 'warning' }, { variant: 'error' }])).toEqual('row-error');
});
