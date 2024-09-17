import type { DataClass } from './dataclass';
import { className, classType, headerTitles } from './dataclass-utils';

describe('classType', () => {
  test('data', () => {
    const dataClass = {} as DataClass;
    expect(classType(dataClass)).toEqual('DATA');
  });

  test('businessData', () => {
    const dataClass = { isBusinessCaseData: true } as DataClass;
    expect(classType(dataClass)).toEqual('BUSINESS_DATA');
  });

  test('entity', () => {
    const dataClass = { entity: {} } as DataClass;
    expect(classType(dataClass)).toEqual('ENTITY');
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
