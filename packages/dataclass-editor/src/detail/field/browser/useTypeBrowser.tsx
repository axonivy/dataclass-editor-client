import { BasicCheckbox, useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { DataclassType } from '../../../protocol/types';
import { typeBrowserApply } from './typeBrowserApply';
import { useEffect, useMemo, useState } from 'react';
import { useMeta } from '../../../context/useMeta';
import { typeData } from '../../../data/type-data';
import { useAppContext } from '../../../context/AppContext';

export const useTypeBrowser = (): Browser => {
  const { context } = useAppContext();
  const [allTypesSearchActive, setAllTypesSearchActive] = useState<boolean>(false);
  const [typeAsList, setTypeAsList] = useState<boolean>(false);

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
  const typesList = useBrowser(types);
  console.log(context);

  useEffect(() => {
    setMetaFilter(typesList.globalFilter.filter);
  }, [allTypesSearchActive, typesList.globalFilter.filter]);

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
