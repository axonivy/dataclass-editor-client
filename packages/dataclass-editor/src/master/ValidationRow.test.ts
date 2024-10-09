import { customRenderHook } from '../context/test-utils/test-utils';
import type { DataClass } from '../data/dataclass';
import { rowClassName, useUpdateOrder } from './ValidationRow';

test('useUpdateOrder', () => {
  const dataClass = {
    fields: [{ name: 'field0' }, { name: 'field1' }, { name: 'field2' }, { name: 'field3' }, { name: 'field4' }]
  } as DataClass;
  let newDataClass = {} as DataClass;
  const view = customRenderHook(() => useUpdateOrder(), {
    wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
  });

  const originalDataClass = structuredClone(dataClass);
  view.result.current('0', '2');
  expect(dataClass).toEqual(originalDataClass);

  expect(newDataClass.fields).toEqual([{ name: 'field1' }, { name: 'field2' }, { name: 'field0' }, { name: 'field3' }, { name: 'field4' }]);

  view.result.current('2', '4');
  expect(newDataClass.fields).toEqual([{ name: 'field0' }, { name: 'field1' }, { name: 'field3' }, { name: 'field4' }, { name: 'field2' }]);

  view.result.current('4', '0');
  expect(newDataClass.fields).toEqual([{ name: 'field4' }, { name: 'field0' }, { name: 'field1' }, { name: 'field2' }, { name: 'field3' }]);
});

test('rowClassName', () => {
  expect(rowClassName([{ variant: 'info' }, { variant: 'info' }, { variant: 'info' }])).toBeUndefined();
  expect(rowClassName([{ variant: 'info' }, { variant: 'warning' }, { variant: 'warning' }])).toEqual('row-warning');
  expect(rowClassName([{ variant: 'info' }, { variant: 'warning' }, { variant: 'error' }])).toEqual('row-error');
});
