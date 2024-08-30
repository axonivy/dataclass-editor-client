import type { DataClass } from './dataclass';
import { isEntityClass } from './dataclass-utils';

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
