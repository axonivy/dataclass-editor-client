import type { DataClass } from '@axonivy/dataclass-editor-protocol';
import { headerTitles } from './DataClassEditor';

describe('headerTitles', () => {
  describe('title', () => {
    test('data', () => {
      const dataClass = { simpleName: 'DataClassName' } as DataClass;
      const { masterTitle } = headerTitles(dataClass);
      expect(masterTitle).toEqual('Data Class - DataClassName');
    });

    test('businessData', () => {
      const dataClass = { simpleName: 'BusinessDataClassName', isBusinessCaseData: true } as DataClass;
      const { masterTitle } = headerTitles(dataClass);
      expect(masterTitle).toEqual('Business Data Class - BusinessDataClassName');
    });

    test('entity', () => {
      const dataClass = { simpleName: 'EntityClassName', entity: {} } as DataClass;
      const { masterTitle } = headerTitles(dataClass);
      expect(masterTitle).toEqual('Entity Class - EntityClassName');
    });
  });

  describe('detailTitle', () => {
    test('data', () => {
      const dataClass = { simpleName: 'DataClassName' } as DataClass;
      const { detailTitle } = headerTitles(dataClass);
      expect(detailTitle).toEqual('Data Class - DataClassName');
    });

    test('businessData', () => {
      const dataClass = { simpleName: 'BusinessDataClassName', isBusinessCaseData: true } as DataClass;
      const { detailTitle } = headerTitles(dataClass);
      expect(detailTitle).toEqual('Business Data Class - BusinessDataClassName');
    });

    test('entity', () => {
      const dataClass = { simpleName: 'EntityClassName', entity: {} } as DataClass;
      const { detailTitle } = headerTitles(dataClass);
      expect(detailTitle).toEqual('Entity Class - EntityClassName');
    });

    test('attribute', () => {
      const dataClass = { fields: [{ name: 'FieldName0' }, { name: 'FieldName1' }] } as DataClass;
      const { detailTitle } = headerTitles(dataClass, 1);
      expect(detailTitle).toEqual('Attribute - FieldName1');
    });
  });
});
