import {
  addRow,
  BasicField,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Flex,
  Input,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type Table } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { DataClass, DataClassField } from '../data/dataclass';
import { isEntity } from '../data/dataclass-utils';
import { InputFieldWithTypeBrowser } from '../detail/field/InputFieldWithTypeBrowser';

export const validateFieldName = (name: string, dataClass: DataClass): MessageData => {
  if (name.trim() === '') {
    return toErrorMessage('Name cannot be empty.');
  }
  if (dataClass.fields.some(field => field.name === name)) {
    return toErrorMessage('Name is already taken.');
  }
};

export const validateFieldType = (type: string): MessageData => {
  if (type.trim() === '') {
    return toErrorMessage('Type cannot be empty.');
  }
};

const toErrorMessage = (message: string) => {
  return { message: message, variant: 'error' };
};

type AddFieldDialogProps = {
  table: Table<DataClassField>;
};

export const AddFieldDialog = ({ table }: AddFieldDialogProps) => {
  const { dataClass, setDataClass, setSelectedField } = useAppContext();

  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const nameValidationMessage = useMemo(() => validateFieldName(name, dataClass), [name, dataClass]);
  const typeValidationMessage = useMemo(() => validateFieldType(type), [type]);

  const initializeAddFieldDialog = () => {
    setName('newAttribute');
    setType('String');
  };

  const addField = () => {
    const newField: DataClassField = {
      name: name,
      type: type,
      comment: '',
      modifiers: ['PERSISTENT'],
      annotations: [],
      entity: isEntity(dataClass)
        ? {
            databaseName: '',
            databaseFieldLength: '',
            cascadeTypes: ['PERSIST', 'MERGE'],
            mappedByFieldName: '',
            orphanRemoval: false
          }
        : undefined
    };
    const newFields = addRow(table, dataClass.fields, newField);

    const newDataClass = structuredClone(dataClass);
    newDataClass.fields = newFields;
    setDataClass(newDataClass);
    setSelectedField(newDataClass.fields.length - 1);
  };

  const allInputsValid = () => !nameValidationMessage && !typeValidationMessage;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className='add-field-dialog-trigger-button'
          icon={IvyIcons.Plus}
          onClick={initializeAddFieldDialog}
          aria-label='Add field'
        />
      </DialogTrigger>
      <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>New Attribute</DialogTitle>
        </DialogHeader>
        <Flex direction='column' gap={2}>
          <BasicField label='Name' message={nameValidationMessage} aria-label='Name'>
            <Input value={name} onChange={event => setName(event.target.value)} />
          </BasicField>
          <InputFieldWithTypeBrowser value={type} message={typeValidationMessage} onChange={setType} />
        </Flex>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='primary' size='large' type='submit' aria-label='Create field' disabled={!allInputsValid()} onClick={addField}>
              Create Attribute
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
