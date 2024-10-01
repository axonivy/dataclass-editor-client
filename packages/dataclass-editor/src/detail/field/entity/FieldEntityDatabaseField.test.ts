import { defaultLengthOfType, typeCanHaveDatabaseLength } from './FieldEntityDatabaseField';

describe('typeCanHaveDatabaseLength', () => {
  test('true', () => {
    expect(typeCanHaveDatabaseLength('String')).toBeTruthy();
    expect(typeCanHaveDatabaseLength('BigInteger')).toBeTruthy();
    expect(typeCanHaveDatabaseLength('BigDecimal')).toBeTruthy();
  });

  test('false', () => {
    expect(typeCanHaveDatabaseLength('AnythingElse')).toBeFalsy();
  });
});

describe('defaultLengthOfType', () => {
  test('present', () => {
    expect(defaultLengthOfType('String')).toEqual('255');
    expect(defaultLengthOfType('BigInteger')).toEqual('19,2');
    expect(defaultLengthOfType('BigDecimal')).toEqual('19,2');
  });

  test('not present', () => {
    expect(defaultLengthOfType('AnythingElse')).toEqual('');
  });
});
