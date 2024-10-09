import type { BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { DataclassType, JavaType } from '../protocol/types';

export const typeData = (dataClasses: DataclassType[], ivyTypes: JavaType[]): Array<BrowserNode<DataclassType>> => {
  const sortedDataClasses = dataClasses.sort((a, b) => a.name.localeCompare(b.name));

  const nonIvyTypes = ivyTypes.filter(type => !isIvyType(type.fullQualifiedName));
  const ivyOnlyTypes = ivyTypes.filter(type => isIvyType(type.fullQualifiedName));

  const sortedNonIvyTypes = nonIvyTypes.sort((a, b) => a.simpleName.localeCompare(b.simpleName));
  const sortedIvyOnlyTypes = ivyOnlyTypes.sort((a, b) => a.simpleName.localeCompare(b.simpleName));

  const dataClassNodes = sortedDataClasses.map<BrowserNode<DataclassType>>(dataClass => ({
    value: dataClass.name,
    info: dataClass.packageName,
    icon: IvyIcons.LetterD,
    data: dataClass,
    children: [],
    isLoaded: true
  }));

  const nonIvyTypeNodes = sortedNonIvyTypes.map<BrowserNode<DataclassType>>(javaType => ({
    value: javaType.simpleName,
    info: javaType.packageName,
    icon: IvyIcons.DataClass,
    data: { ...javaType, name: javaType.simpleName, path: '' },
    children: [],
    isLoaded: true
  }));

  const ivyTypeNodes = sortedIvyOnlyTypes.map<BrowserNode<DataclassType>>(javaType => ({
    value: javaType.simpleName,
    info: javaType.packageName,
    icon: IvyIcons.Ivy,
    data: { ...javaType, name: javaType.simpleName, path: '' },
    children: [],
    isLoaded: true
  }));

  return [...dataClassNodes, ...nonIvyTypeNodes, ...ivyTypeNodes];
};

const isIvyType = (fullQualifiedName: string) => {
  return fullQualifiedName.includes('ivy');
};
