import { customRenderHook } from '../../context/test-utils/test-utils';
import type { DataClass, DataClassField, DataClassFieldModifier } from '../../data/dataclass';
import { useClassType } from './DataClassType';

describe('useClassType', () => {
  const expectClassType = (
    dataClass: DataClass,
    isBusinessCaseData: boolean,
    hasEntity: boolean,
    modifiers: Array<Array<DataClassFieldModifier>>
  ) => {
    expect(dataClass.isBusinessCaseData).toEqual(isBusinessCaseData);
    expect(!!dataClass.entity).toEqual(hasEntity);
    expect(dataClass.fields.every((field: DataClassField) => !!field.entity === hasEntity)).toBeTruthy();
    for (let i = 0; i < modifiers.length; i++) {
      expect(dataClass.fields[i].modifiers).toEqual(modifiers[i]);
    }
  };

  test('data to business', () => {
    const dataClass = {
      isBusinessCaseData: false,
      entity: undefined,
      fields: [
        { modifiers: ['PERSISTENT'], entity: undefined },
        { modifiers: [], entity: undefined }
      ]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useClassType(), {
      wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
    });
    expect(view.result.current.classType).toEqual('DATA');

    const originalDataClass = structuredClone(dataClass);
    view.result.current.setClassType('BUSINESS_DATA');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, true, false, [['PERSISTENT'], []]);
  });

  test('data to entity', () => {
    const dataClass = {
      isBusinessCaseData: false,
      entity: undefined,
      fields: [
        { modifiers: ['PERSISTENT'], entity: undefined },
        { modifiers: [], entity: undefined }
      ]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useClassType(), {
      wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
    });
    expect(view.result.current.classType).toEqual('DATA');

    const originalDataClass = structuredClone(dataClass);
    view.result.current.setClassType('ENTITY');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, false, true, [['PERSISTENT'], []]);
  });

  test('business to data', () => {
    const dataClass = {
      isBusinessCaseData: true,
      entity: undefined,
      fields: [
        { modifiers: ['PERSISTENT'], entity: undefined },
        { modifiers: [], entity: undefined }
      ]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useClassType(), {
      wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
    });
    expect(view.result.current.classType).toEqual('BUSINESS_DATA');

    const originalDataClass = structuredClone(dataClass);
    view.result.current.setClassType('DATA');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, false, false, [['PERSISTENT'], []]);
  });

  test('business to entity', () => {
    const dataClass = {
      isBusinessCaseData: true,
      entity: undefined,
      fields: [
        { modifiers: ['PERSISTENT'], entity: undefined },
        { modifiers: [], entity: undefined }
      ]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useClassType(), {
      wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
    });
    expect(view.result.current.classType).toEqual('BUSINESS_DATA');

    const originalDataClass = structuredClone(dataClass);
    view.result.current.setClassType('ENTITY');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, false, true, [['PERSISTENT'], []]);
  });

  test('entity to data', () => {
    const dataClass = {
      isBusinessCaseData: false,
      entity: {},
      fields: [
        { modifiers: ['PERSISTENT', 'ID', 'GENERATED'], entity: undefined },
        { modifiers: ['NOT_INSERTABLE', 'NOT_NULLABLE', 'NOT_UPDATEABLE', 'UNIQUE'], entity: undefined }
      ]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useClassType(), {
      wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
    });
    expect(view.result.current.classType).toEqual('ENTITY');

    const originalDataClass = structuredClone(dataClass);
    view.result.current.setClassType('DATA');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, false, false, [['PERSISTENT'], []]);
  });

  test('entity to business', () => {
    const dataClass = {
      isBusinessCaseData: false,
      entity: {},
      fields: [
        { modifiers: ['PERSISTENT', 'ID', 'GENERATED'], entity: undefined },
        { modifiers: ['NOT_INSERTABLE', 'NOT_NULLABLE', 'NOT_UPDATEABLE', 'UNIQUE'], entity: undefined }
      ]
    } as DataClass;
    let newDataClass = {} as DataClass;
    const view = customRenderHook(() => useClassType(), {
      wrapperProps: { appContext: { dataClass, setDataClass: dataClass => (newDataClass = dataClass) } }
    });
    expect(view.result.current.classType).toEqual('ENTITY');

    const originalDataClass = structuredClone(dataClass);
    view.result.current.setClassType('BUSINESS_DATA');
    expect(dataClass).toEqual(originalDataClass);

    expectClassType(newDataClass, true, false, [['PERSISTENT'], []]);
  });
});
