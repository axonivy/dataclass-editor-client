import {
  BasicCheckbox,
  BasicField,
  Button,
  Combobox,
  Dialog,
  DialogContent,
  DialogTrigger,
  Flex,
  IvyIcon,
  type BrowserNode,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useState } from 'react';
import { Browser } from './browser/Browser';
import { useAppContext } from '../../context/AppContext';
import { useMeta } from '../../context/useMeta';
import { typeData } from '../../data/type-data';
import './ComboboxFieldWithTypeBrowser.css';
import type { DataclassType } from '@axonivy/dataclass-editor-protocol';

export type InputFieldProps = {
  value: string;
  onChange: (value: string) => void;
  message?: MessageData;
};

export const ComboboxFieldWithTypeBrowser = ({ value, onChange, message }: InputFieldProps) => {
  const [open, setOpen] = useState(false);
  const { context } = useAppContext();
  const [typeAsList, setTypeAsList] = useState<boolean>(false);
  const dataClasses = useMeta('meta/scripting/dataClasses', context, []).data;
  const ivyTypes = useMeta('meta/scripting/ivyTypes', undefined, []).data;
  const types = useMemo(() => typeData(dataClasses, ivyTypes, [], [], true), [dataClasses, ivyTypes]);

  const typeAsListChange = (change: boolean) => {
    setTypeAsList(!typeAsList);
    if (change && !(value.startsWith('List<') && value.endsWith('>'))) {
      onChange(`List<${value}>`);
    } else if (!change && value.startsWith('List<') && value.endsWith('>')) {
      const removeListFromValue = value.slice(5, -1);
      onChange(removeListFromValue);
    }
  };

  const ExtendedComboboxItem = ({ icon, value, info }: BrowserNode<DataclassType>) => (
    <Flex gap={1} alignItems='center'>
      <IvyIcon icon={icon} />
      <span>{value}</span>
      <span style={{ color: 'var(--N700)' }}>{info}</span>
    </Flex>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label='Type' message={message} aria-label='Type'>
        <Flex direction='row' gap={2} alignItems='center' className='combobox-with-type-browser'>
          <Combobox
            onChange={value => {
              const foundDataclassType = dataClasses.find(type => type.name === value);
              if (foundDataclassType) {
                onChange(foundDataclassType.fullQualifiedName);
              } else {
                onChange(value);
              }
              if (!value.startsWith('List<') && !value.endsWith('>')) {
                setTypeAsList(false);
              }
            }}
            value={value}
            options={types}
            itemRender={option => <ExtendedComboboxItem {...option} />}
          />
          <DialogTrigger asChild>
            <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
          </DialogTrigger>
        </Flex>
        <BasicCheckbox label='Type as List' checked={typeAsList} onCheckedChange={change => typeAsListChange(change as boolean)} />
      </BasicField>
      <DialogContent style={{ height: '80vh' }}>
        <Browser
          onChange={value => {
            onChange(value);
            if (value.startsWith('List<') && value.endsWith('>')) {
              setTypeAsList(true);
            }
          }}
          value={value}
          close={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
