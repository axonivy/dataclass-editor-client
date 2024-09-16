import type { DataClass } from './dataclass';
import { className, classType } from './dataclass-utils';

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

describe('className', () => {
  test('qualified', () => {
    expect(className('ch.ivyteam.ivy.ClassName')).toEqual('ClassName');
  });

  test('notQualified', () => {
    expect(className('ClassName')).toEqual('ClassName');
  });
});
