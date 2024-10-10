import { describe, expect } from 'vitest';
import type { BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { DataclassType, JavaType } from '../../protocol/types';
import { getApplyValue } from './typeBrowserHelper';

const javaType: JavaType = {
  fullQualifiedName: 'com.example.TypeA',
  packageName: 'com.example',
  simpleName: 'TypeA'
};

const type: BrowserNode<DataclassType> = {
  value: 'TypeA',
  info: 'com.example',
  icon: IvyIcons.DataClass,
  children: []
};

describe('getApplyValue', () => {
  test('return empty string when type undefined', () => {
    const result = getApplyValue(undefined, [javaType], false);
    expect(result).toBe('');
  });

  test('return type value when ivyTypes contains fullQualifiedName and typeAsList is false', () => {
    const result = getApplyValue(type, [javaType], false);
    expect(result).toBe('TypeA');
  });

  test('return List<type value> when ivyTypes contains fullQualifiedName and typeAsList is true', () => {
    const result = getApplyValue(type, [javaType], true);
    expect(result).toBe('List<TypeA>');
  });

  test('return full qualified name when ivyTypes does not contain fullQualifiedName and typeAsList is false', () => {
    const otherJavaTypes: JavaType[] = [
      {
        fullQualifiedName: 'com.other.TypeB',
        packageName: 'com.other',
        simpleName: 'TypeB'
      }
    ];
    const result = getApplyValue(type, otherJavaTypes, false);
    expect(result).toBe('com.example.TypeA');
  });

  test('return List<full qualified name> when ivyTypes does not contain fullQualifiedName and typeAsList is true', () => {
    const otherJavaTypes: JavaType[] = [
      {
        fullQualifiedName: 'com.other.TypeB',
        packageName: 'com.other',
        simpleName: 'TypeB'
      }
    ];
    const result = getApplyValue(type, otherJavaTypes, true);
    expect(result).toBe('List<com.example.TypeA>');
  });
});
