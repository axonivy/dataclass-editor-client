import type { DataClass, DataClassField, DataClassFieldModifier } from './dataclass';
import {
  className,
  classTypeOf,
  defaultDatabaseFieldLengthOf,
  fieldTypeCanHaveDatabaseFieldLength,
  headerTitles,
  isDataClassIDType,
  isDataClassVersionType,
  isEntity,
  isEntityField
} from './dataclass-utils';

describe('classTypeOf', () => {
  test('data', () => {
    const dataClass = {} as DataClass;
    expect(classTypeOf(dataClass)).toEqual('DATA');
  });

  test('businessData', () => {
    const dataClass = { isBusinessCaseData: true } as DataClass;
    expect(classTypeOf(dataClass)).toEqual('BUSINESS_DATA');
  });

  test('entity', () => {
    const dataClass = { entity: {} } as DataClass;
    expect(classTypeOf(dataClass)).toEqual('ENTITY');
  });
});

describe('isEntity', () => {
  test('true', () => {
    const dataClass = { entity: {} } as DataClass;
    expect(isEntity(dataClass)).toBeTruthy();
  });

  test('false', () => {
    const dataClass = {} as DataClass;
    expect(isEntity(dataClass)).toBeFalsy();
  });
});

describe('isEntityField', () => {
  test('true', () => {
    const field = { modifiers: ['PERSISTENT'], entity: {} } as DataClassField;
    expect(isEntityField(field)).toBeTruthy();
  });

  describe('false', () => {
    test('argument is undefine', () => {
      expect(isEntityField()).toBeFalsy();
    });

    test('missing modifier persistent', () => {
      const field = { modifiers: [] as Array<DataClassFieldModifier>, entity: {} } as DataClassField;
      expect(isEntityField(field)).toBeFalsy();
    });

    test('missing entity', () => {
      const field = { modifiers: ['PERSISTENT'] } as DataClassField;
      expect(isEntityField(field)).toBeFalsy();
    });
  });
});

describe('headerTitles', () => {
  describe('title', () => {
    test('data', () => {
      const dataClass = {} as DataClass;
      const { masterTitle } = headerTitles(dataClass);
      expect(masterTitle).toEqual('Data Editor');
    });

    test('businessData', () => {
      const dataClass = { isBusinessCaseData: true } as DataClass;
      const { masterTitle } = headerTitles(dataClass);
      expect(masterTitle).toEqual('Business Data Editor');
    });

    test('entity', () => {
      const dataClass = { entity: {} } as DataClass;
      const { masterTitle } = headerTitles(dataClass);
      expect(masterTitle).toEqual('Entity Editor');
    });
  });

  describe('detailTitle', () => {
    test('data', () => {
      const dataClass = { simpleName: 'DataClassName' } as DataClass;
      const { detailTitle } = headerTitles(dataClass);
      expect(detailTitle).toEqual('Data - DataClassName');
    });

    test('businessData', () => {
      const dataClass = { simpleName: 'BusinessDataClassName', isBusinessCaseData: true } as DataClass;
      const { detailTitle } = headerTitles(dataClass);
      expect(detailTitle).toEqual('Business Data - BusinessDataClassName');
    });

    test('entity', () => {
      const dataClass = { simpleName: 'EntityClassName', entity: {} } as DataClass;
      const { detailTitle } = headerTitles(dataClass);
      expect(detailTitle).toEqual('Entity - EntityClassName');
    });

    test('attribute', () => {
      const dataClass = { fields: [{ name: 'FieldName0' }, { name: 'FieldName1' }] } as DataClass;
      const { detailTitle } = headerTitles(dataClass, 1);
      expect(detailTitle).toEqual('Attribute - FieldName1');
    });
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

describe('fieldTypeCanHaveDatabaseFieldLength', () => {
  test('true', () => {
    expect(fieldTypeCanHaveDatabaseFieldLength('String')).toBeTruthy();
    expect(fieldTypeCanHaveDatabaseFieldLength('BigInteger')).toBeTruthy();
    expect(fieldTypeCanHaveDatabaseFieldLength('BigDecimal')).toBeTruthy();
  });

  test('false', () => {
    expect(fieldTypeCanHaveDatabaseFieldLength('AnythingElse')).toBeFalsy();
  });
});

describe('defaultDatabaseFieldLengthOf', () => {
  test('present', () => {
    expect(defaultDatabaseFieldLengthOf('String')).toEqual('255');
    expect(defaultDatabaseFieldLengthOf('BigInteger')).toEqual('19,2');
    expect(defaultDatabaseFieldLengthOf('BigDecimal')).toEqual('19,2');
  });

  test('not present', () => {
    expect(defaultDatabaseFieldLengthOf('AnythingElse')).toEqual('');
  });
});

describe('isDataClassIDType', () => {
  test('true', () => {
    expect(isDataClassIDType('String')).toBeTruthy();
    expect(isDataClassIDType('Integer')).toBeTruthy();
    expect(isDataClassIDType('Long')).toBeTruthy();
  });

  test('false', () => {
    expect(isDataClassIDType('AnythingElse')).toBeFalsy();
  });
});

describe('isDataClassVersionType', () => {
  test('true', () => {
    expect(isDataClassVersionType('Short')).toBeTruthy();
    expect(isDataClassVersionType('Integer')).toBeTruthy();
    expect(isDataClassVersionType('Long')).toBeTruthy();
    expect(isDataClassVersionType('java.sql.Timestamp')).toBeTruthy();
  });

  test('false', () => {
    expect(isDataClassVersionType('AnythingElse')).toBeFalsy();
  });
});
