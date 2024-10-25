import { isIDType, isVersionType } from '@axonivy/dataclass-editor-protocol';

describe('isIDType', () => {
  test('true', () => {
    expect(isIDType('String')).toBeTruthy();
    expect(isIDType('Integer')).toBeTruthy();
    expect(isIDType('Long')).toBeTruthy();
  });

  test('false', () => {
    expect(isIDType('AnythingElse')).toBeFalsy();
  });
});

describe('isVersionType', () => {
  test('true', () => {
    expect(isVersionType('Short')).toBeTruthy();
    expect(isVersionType('Integer')).toBeTruthy();
    expect(isVersionType('Long')).toBeTruthy();
    expect(isVersionType('java.sql.Timestamp')).toBeTruthy();
  });

  test('false', () => {
    expect(isVersionType('AnythingElse')).toBeFalsy();
  });
});
