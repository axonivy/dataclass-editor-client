import {
  BasicField,
  BasicInput,
  BrowsersView,
  type Browser,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  InputGroup,
  type BrowserNode,
  useBrowser,
  BasicCheckbox,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useState } from 'react';
import { typeData } from '../../data/type-data';
import { useAppContext } from '../../context/AppContext';
import { useMeta } from '../../context/useMeta';
import type { DataclassType } from '../../protocol/types';
import { getApplyValue } from '../../utils/lambda/typeBrowserHelper';

export type InputFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  message?: MessageData;
};

export const InputFieldWithTypeBrowser = ({ value, onChange, onBlur, message }: InputFieldProps) => {
  const [open, setOpen] = useState(false);
  const { context } = useAppContext();

  const [typeAsList, setTypeAsList] = useState<boolean>(false);
  const dataClasses = useMeta('meta/scripting/dataClasses', context, []).data;
  const ivyTypes = useMeta('meta/scripting/ivyTypes', undefined, []).data;
  const types = useMemo(() => typeData(dataClasses, ivyTypes), [dataClasses, ivyTypes]);

  const typesList = useBrowser(types, undefined);

  const typeBrowser: Browser = {
    name: 'Type',
    icon: IvyIcons.DataClass,
    browser: typesList,
    header: <BasicCheckbox label='Type as List' checked={typeAsList} onCheckedChange={() => setTypeAsList(!typeAsList)} />,
    infoProvider: row => getApplyValue(row?.original as BrowserNode<DataclassType>, ivyTypes, typeAsList),
    applyModifier: row => ({ value: getApplyValue(row.original as BrowserNode<DataclassType>, ivyTypes, typeAsList) })
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label='Type' style={{ flex: '1' }} message={message} aria-label='Type'>
        <InputGroup>
          <BasicInput value={value} onChange={event => onChange(event.target.value)} onBlur={onBlur} />
          <DialogTrigger asChild>
            <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
          </DialogTrigger>
        </InputGroup>
      </BasicField>
      <DialogContent style={{ height: '80vh' }}>
        <BrowsersView
          browsers={[typeBrowser]}
          apply={(browserName, result) => {
            if (result) {
              onChange(result.value);
            }
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
