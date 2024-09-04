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
  Input
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type Table } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import type { DataClassField } from '../data/dataclass';
import { newFieldName } from '../data/dataclass-utils';
import { validateFieldName, validateFieldType } from '../data/validation-utils';

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
    setName(newFieldName(dataClass));
    setType('String');
  };

  const addField = () => {
    const newField = {
      name: name,
      type: type,
      comment: '',
      modifiers: [],
      annotations: []
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
          <BasicField label='Type' message={typeValidationMessage} aria-label='Type'>
            <Input value={type} onChange={event => setType(event.target.value)} />
          </BasicField>
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
