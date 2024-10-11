import { BasicCheckbox, useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { DataclassType } from '../../../protocol/types';
import { typeBrowserApply } from './typeBrowserApply';
import { useMemo, useState } from 'react';
import { useMeta } from '../../../context/useMeta';
import { typeData } from '../../../data/type-data';
import { useAppContext } from '../../../context/AppContext';

export const useTypeBrowser = (): Browser => {
  const { context } = useAppContext();
  const [typeAsList, setTypeAsList] = useState<boolean>(false);
  const dataClasses = useMeta('meta/scripting/dataClasses', context, []).data;
  const ivyTypes = useMeta('meta/scripting/ivyTypes', undefined, []).data;
  const types = useMemo(() => typeData(dataClasses, ivyTypes), [dataClasses, ivyTypes]);
  const typesList = useBrowser(types);
  return {
    name: 'Type',
    icon: IvyIcons.DataClass,
    browser: typesList,
    footer: <BasicCheckbox label='Type as List' checked={typeAsList} onCheckedChange={() => setTypeAsList(!typeAsList)} />,
    infoProvider: row => typeBrowserApply(row?.original as BrowserNode<DataclassType>, ivyTypes, typeAsList),
    applyModifier: row => ({ value: typeBrowserApply(row.original as BrowserNode<DataclassType>, ivyTypes, typeAsList) })
  };
};
