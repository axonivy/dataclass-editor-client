import { simpleTypeName } from './DataClassMasterContent';

test('simpleTypeName', () => {
  expect(simpleTypeName('String')).toEqual('String');
  expect(simpleTypeName('List<String>')).toEqual('List<String>');
  expect(simpleTypeName('Map<String, Integer>')).toEqual('Map<String, Integer>');
  expect(simpleTypeName('Map<List<Timestamp>, Map<String, Integer>>')).toEqual('Map<List<Timestamp>, Map<String, Integer>>');

  expect(simpleTypeName('java.lang.String')).toEqual('String');
  expect(simpleTypeName('java.util.List<java.lang.String>')).toEqual('List<String>');
  expect(simpleTypeName('java.util.Map<java.lang.String, java.lang.Integer>')).toEqual('Map<String, Integer>');
  expect(simpleTypeName('java.util.Map<java.util.List<java.sql.Timestamp>, java.util.Map<java.util.String, java.util.Integer>>')).toEqual(
    'Map<List<Timestamp>, Map<String, Integer>>'
  );
});
