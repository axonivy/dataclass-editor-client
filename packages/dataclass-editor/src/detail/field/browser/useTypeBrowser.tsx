import { BasicCheckbox, useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { DataclassType } from '../../../protocol/types';
import { typeBrowserApply } from './typeBrowserApply';
import { useEffect, useMemo, useState } from 'react';
import { useMeta } from '../../../context/useMeta';
import { typeData } from '../../../data/type-data';
import { useAppContext } from '../../../context/AppContext';
import { getInitialSelectState, getInitialTypeAsListState, getInitialValue } from '../../../utils/browser/typeBrowserUtils';

export const useTypeBrowser = (value: string): Browser => {
  const { context } = useAppContext();
  const [allTypesSearchActive, setAllTypesSearchActive] = useState<boolean>(false);

  const dataClasses = useMeta('meta/scripting/dataClasses', context, []).data;
  const ivyTypes = useMeta('meta/scripting/ivyTypes', undefined, []).data;

  const [metaFilter, setMetaFilter] = useState('');
  const ownTypes = useMeta('meta/scripting/ownTypes', { context, limit: 50, type: metaFilter }, [], { disable: allTypesSearchActive }).data;
  const allDatatypes = useMeta('meta/scripting/allTypes', { context, limit: 150, type: metaFilter }, [], {
    disable: !allTypesSearchActive
  }).data;

  const types = useMemo(
    () => typeData(dataClasses, ivyTypes, ownTypes, allDatatypes, allTypesSearchActive),
    [allDatatypes, allTypesSearchActive, dataClasses, ivyTypes, ownTypes]
  );

  const [typeAsList, setTypeAsList] = useState<boolean>(getInitialTypeAsListState(types, getInitialValue(value)));

  const typesList = useBrowser(types, {
    expandedState:
      metaFilter.length > 0
        ? true
        : {
            '0': dataClasses.some(dataclass => dataclass.fullQualifiedName === getInitialValue(value).value),
            '1': ivyTypes.some(ivyType => ivyType.simpleName === getInitialValue(value).value)
          },
    initialSelecteState: getInitialSelectState(allTypesSearchActive, types, getInitialValue(value))
  });

  useEffect(() => {
    setMetaFilter(typesList.globalFilter.filter);
    if (typesList.globalFilter.filter.length > 0) {
      typesList.table.setExpanded(true);
    }
  }, [allTypesSearchActive, typesList.globalFilter.filter, typesList.table]);

  return {
    name: 'Type',
    icon: IvyIcons.DataClass,
    browser: typesList,
    header: !context.file.includes('/neo') ? (
      <BasicCheckbox
        label='Search over all Types'
        checked={allTypesSearchActive}
        onCheckedChange={() => setAllTypesSearchActive(!allTypesSearchActive)}
      />
    ) : undefined,
    footer: <BasicCheckbox label='Type as List' checked={typeAsList} onCheckedChange={() => setTypeAsList(!typeAsList)} />,
    infoProvider: row => typeBrowserApply(row?.original as BrowserNode<DataclassType>, ivyTypes, typeAsList),
    applyModifier: row => ({ value: typeBrowserApply(row.original as BrowserNode<DataclassType>, ivyTypes, typeAsList) })
  };
};
