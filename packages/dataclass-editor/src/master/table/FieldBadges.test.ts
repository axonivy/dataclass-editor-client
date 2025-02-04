import { simpleAnnotationName } from './FieldBadges';

test('simpleAnnotationName', () => {
  expect(simpleAnnotationName('@Deprecated')).toEqual('Deprecated');
  expect(simpleAnnotationName('@SuppressWarnings("unused")')).toEqual('SuppressWarnings');
  expect(simpleAnnotationName('@SuppressWarnings({"unused", "unchecked"})')).toEqual('SuppressWarnings');
  expect(
    simpleAnnotationName(
      '@JoinTable(name = "name", joinColumns = @JoinColumn(name = "name"), inverseJoinColumns = @JoinColumn(name = "name"))'
    )
  ).toEqual('JoinTable');

  expect(simpleAnnotationName('@java.lang.Deprecated')).toEqual('Deprecated');
  expect(simpleAnnotationName('@java.lang.SuppressWarnings("unused")')).toEqual('SuppressWarnings');
  expect(simpleAnnotationName('@java.lang.SuppressWarnings({"unused", "unchecked"})')).toEqual('SuppressWarnings');
  expect(
    simpleAnnotationName(
      '@javax.persistence.JoinTable(name = "name", joinColumns = @javax.persistence.JoinColumn(name = "name"), inverseJoinColumns = @javax.persistence.JoinColumn(name = "name"))'
    )
  ).toEqual('JoinTable');
});
