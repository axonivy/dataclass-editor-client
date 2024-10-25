import { describe, expect } from 'vitest';
import type { DataclassType, JavaType } from '@axonivy/dataclass-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { typeData } from './type-data';

const dataClasses: DataclassType[] = [
  { fullQualifiedName: 'com.example.ClassA', name: 'ClassA', packageName: 'com.example', path: '/path/ClassA' },
  { fullQualifiedName: 'com.example.ClassB', name: 'ClassB', packageName: 'com.example', path: '/path/ClassB' }
];

const ivyTypes: JavaType[] = [
  { fullQualifiedName: 'ivy.IvyTypeA', packageName: 'ivy', simpleName: 'IvyTypeA' },
  { fullQualifiedName: 'com.example.TypeB', packageName: 'com.example', simpleName: 'TypeB' }
];

const nonIvyTypes: JavaType[] = [
  { fullQualifiedName: 'com.other.TypeC', packageName: 'com.other', simpleName: 'TypeC' },
  { fullQualifiedName: 'com.other.TypeD', packageName: 'com.other', simpleName: 'TypeD' }
];

const ownTypes: JavaType[] = [{ fullQualifiedName: 'com.own.TypeE', packageName: 'com.own', simpleName: 'TypeE' }];

const allTypes: JavaType[] = [
  { fullQualifiedName: 'com.example.TypeB', packageName: 'com.example', simpleName: 'TypeB' },
  { fullQualifiedName: 'ivy.IvyTypeF', packageName: 'ivy', simpleName: 'IvyTypeF' },
  { fullQualifiedName: 'com.own.TypeE', packageName: 'com.own', simpleName: 'TypeE' }
];

describe('typeData', () => {
  test('returns empty array if both input arrays are empty', () => {
    const result = typeData([], [], [], [], false);
    expect(result.length).toEqual(2);
  });

  test('returns sorted data class nodes when dataClasses are provided', () => {
    const result = typeData(dataClasses, [], [], [], false);
    expect(result).toHaveLength(2);
    expect(result[0].children[0].value).toBe('ClassA');
    expect(result[0].children[1].value).toBe('ClassB');
  });

  test('returns sorted non-Ivy type nodes when ivyTypes are provided', () => {
    const result = typeData([], nonIvyTypes, [], [], false);
    expect(result).toHaveLength(2);
    expect(result[1].children[0].value).toBe('TypeC');
    expect(result[1].children[1].value).toBe('TypeD');
  });

  test('returns combined sorted nodes from dataClasses and non-Ivy and Ivy types', () => {
    const result = typeData(dataClasses, [...nonIvyTypes, ...ivyTypes], [], [], false);
    expect(result[0].children).toHaveLength(2);
    expect(result[1].children).toHaveLength(4);
    expect(result[0].children[0].value).toBe('ClassA');
    expect(result[0].children[1].value).toBe('ClassB');
    expect(result[1].children[0].value).toBe('TypeB');
    expect(result[1].children[1].value).toBe('TypeC');
    expect(result[1].children[2].value).toBe('TypeD');
    expect(result[1].children[3].value).toBe('IvyTypeA');
  });

  test('correctly classifies and sorts Ivy and non-Ivy types', () => {
    const result = typeData(dataClasses, ivyTypes, [], [], false);
    expect(result[0].children).toHaveLength(2);
    expect(result[1].children).toHaveLength(2);
    expect(result[0].children[0].value).toBe('ClassA');
    expect(result[0].children[1].value).toBe('ClassB');
    expect(result[1].children[0].value).toBe('TypeB');
    expect(result[1].children[1].value).toBe('IvyTypeA');
  });

  test('returns nodes with correct icons', () => {
    const result = typeData(dataClasses, ivyTypes, [], [], false);
    expect(result[0].children[0].icon).toBe(IvyIcons.LetterD);
    expect(result[1].children[0].icon).toBe(IvyIcons.Ivy);
    expect(result[1].children[1].icon).toBe(IvyIcons.Ivy);
  });

  test('includes ownTypes if allTypesSearchActive is false', () => {
    const result = typeData([], [], ownTypes, [], false);
    expect(result).toHaveLength(3);
    expect(result[2].children[0].value).toBe('TypeE');
    expect(result[2].icon).toBe(IvyIcons.DataClass);
  });

  test('does not include ownTypes if allTypesSearchActive is true', () => {
    const result = typeData([], [], ownTypes, [], true);
    expect(result).toHaveLength(0);
  });

  test('returns sorted allTypes when allTypesSearchActive is true', () => {
    const result = typeData([], [], [], allTypes, true);
    expect(result).toHaveLength(3);
    expect(result[0].value).toBe('IvyTypeF');
    expect(result[1].value).toBe('TypeB');
    expect(result[2].value).toBe('TypeE');
  });

  test('returns sorted combined types when allTypesSearchActive is true and filtered types are present', () => {
    const result = typeData(dataClasses, ivyTypes, ownTypes, allTypes, true);
    expect(result).toHaveLength(6);
    expect(result[0].value).toBe('ClassA');
    expect(result[1].value).toBe('ClassB');
    expect(result[2].value).toBe('IvyTypeA');
    expect(result[3].value).toBe('IvyTypeF');
    expect(result[4].value).toBe('TypeB');
    expect(result[5].value).toBe('TypeE');
  });

  test('sorts combined types correctly when allTypesSearchActive is false', () => {
    const result = typeData(dataClasses, ivyTypes, ownTypes, allTypes, false);
    expect(result).toHaveLength(3);
    expect(result[2].children[0].value).toBe('TypeE');
    expect(result[0].children[0].value).toBe('ClassA');
    expect(result[0].children[1].value).toBe('ClassB');
    expect(result[1].children[0].value).toBe('TypeB');
    expect(result[1].children[1].value).toBe('IvyTypeA');
  });
});
