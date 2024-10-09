import { describe, expect } from 'vitest';
import type { DataclassType, JavaType } from '../protocol/types';
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

describe('typeData', () => {
  test('returns empty array if both input arrays are empty', () => {
    const result = typeData([], []);
    expect(result).toEqual([]);
  });

  test('returns sorted data class nodes when dataClasses are provided', () => {
    const result = typeData(dataClasses, []);
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe('ClassA');
    expect(result[1].value).toBe('ClassB');
  });

  test('returns sorted non-Ivy type nodes when ivyTypes are provided', () => {
    const result = typeData([], nonIvyTypes);
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe('TypeC');
    expect(result[1].value).toBe('TypeD');
  });

  test('returns combined sorted nodes from dataClasses and non-Ivy and Ivy types', () => {
    const result = typeData(dataClasses, [...nonIvyTypes, ...ivyTypes]);
    expect(result).toHaveLength(6);
    expect(result[0].value).toBe('ClassA');
    expect(result[1].value).toBe('ClassB');
    expect(result[2].value).toBe('TypeB');
    expect(result[3].value).toBe('TypeC');
    expect(result[4].value).toBe('TypeD');
    expect(result[5].value).toBe('IvyTypeA');
  });

  test('correctly classifies and sorts Ivy and non-Ivy types', () => {
    const result = typeData(dataClasses, ivyTypes);
    expect(result).toHaveLength(4);
    expect(result[0].value).toBe('ClassA');
    expect(result[1].value).toBe('ClassB');
    expect(result[2].value).toBe('TypeB');
    expect(result[3].value).toBe('IvyTypeA');
  });

  test('returns nodes with correct icons', () => {
    const result = typeData(dataClasses, ivyTypes);
    expect(result[0].icon).toBe(IvyIcons.LetterD);
    expect(result[2].icon).toBe(IvyIcons.DataClass);
    expect(result[3].icon).toBe(IvyIcons.Ivy);
  });
});
