import type { BrowserNode } from '@axonivy/ui-components';
import type { DataclassType } from '../../protocol/types';
import { type RowSelectionState } from '@tanstack/react-table';

type InitialTypeBrowserValue = {
  value: string;
  asList: boolean;
};

export const getInitialValue = (value: string): InitialTypeBrowserValue => {
  if (value.startsWith('List<') && value.endsWith('>')) {
    const content = value.slice(5, -1);
    return { value: content, asList: true };
  } else {
    return { value, asList: false };
  }
};
export const getInitialTypeAsListState = (types: Array<BrowserNode<DataclassType>>, value: InitialTypeBrowserValue) => {
  if (value.asList) {
    return (
      types[1].children.some(ivyType => ivyType.value === value.value) ||
      types[0].children.some(dataclass => dataclass.info + '.' + dataclass.value === value.value)
    );
  }
  return false;
};

export const getInitialSelectState = (
  allTypesSearchActive: boolean,
  types: Array<BrowserNode<DataclassType>>,
  value: InitialTypeBrowserValue
): RowSelectionState => {
  if (!allTypesSearchActive) {
    const ivyTypeIndex = types[1].children.findIndex(ivyType => ivyType.value === value.value);
    if (ivyTypeIndex !== -1) {
      return { [`1.${ivyTypeIndex}`]: true };
    }
    const dataClassIndex = types[0].children.findIndex(dataclass => dataclass.info + '.' + dataclass.value === value.value);
    if (dataClassIndex !== -1) {
      return { [`0.${dataClassIndex}`]: true };
    }
  }
  return {};
};
