import type { DataClass } from './dataclass';
import { className, isEntityClass } from './dataclass-utils';

describe('isEntityClass', () => {
  test('true', () => {
    const dataClass = { entity: {} } as DataClass;
    expect(isEntityClass(dataClass)).toBeTruthy();
  });

  test('false', () => {
    const dataClass = {} as DataClass;
    expect(isEntityClass(dataClass)).toBeFalsy();
  });
});

describe('className', () => {
  test('qualified', () => {
    expect(className('ch.ivyteam.ivy.ClassName')).toEqual('ClassName');
  });

  test('notQualified', () => {
    expect(className('ClassName')).toEqual('ClassName');
  });
});
