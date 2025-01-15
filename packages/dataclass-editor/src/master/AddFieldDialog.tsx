import {
  addRow,
  BasicField,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Flex,
  hotkeyText,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type Table } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { DataClass, Field } from '@axonivy/dataclass-editor-protocol';
import { isEntity } from '../data/dataclass-utils';
import { BROWSER_LABEL, InputFieldWithTypeBrowser } from '../detail/field/InputFieldWithTypeBrowser';
import { useHotkeys } from 'react-hotkeys-hook';
import { HOTKEYS, useHotkeyTexts } from '../utils/hotkeys';

export const validateFieldName = (name: string, dataClass: DataClass) => {
  if (name.trim() === '') {
    return toErrorMessage('Name cannot be empty.');
  }
  if (dataClass.fields.some(field => field.name === name)) {
    return toErrorMessage('Name is already taken.');
  }
  return;
};

export const validateFieldType = (type: string) => {
  if (type.trim() === '') {
    return toErrorMessage('Type cannot be empty.');
  }
  return;
};

const toErrorMessage = (message: string): MessageData => {
  return { message: message, variant: 'error' };
};

type AddFieldDialogProps = {
  table: Table<Field>;
};

export const AddFieldDialog = ({ table }: AddFieldDialogProps) => {
  const { dataClass, setDataClass } = useAppContext();

  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const nameValidationMessage = useMemo(() => validateFieldName(name, dataClass), [name, dataClass]);
  const typeValidationMessage = useMemo(() => validateFieldType(type), [type]);

  const initializeAddFieldDialog = () => {
    setName('newAttribute');
    setType('String');
  };

  const addField = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | KeyboardEvent) => {
    const newField: Field = {
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
    if (!e.ctrlKey && !e.metaKey) {
      setOpen(false);
    }
  };

  const allInputsValid = () => !nameValidationMessage && !typeValidationMessage;
  const [open, setOpen] = useState(false);
  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      initializeAddFieldDialog();
    }
  };
  useHotkeys(HOTKEYS.ADD_ATTR, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  const { addAttr: shortcut } = useHotkeyTexts();
  const enter = useHotkeys(
    ['Enter', 'mod+Enter'],
    e => {
      if (!allInputsValid() || document.activeElement?.ariaLabel === BROWSER_LABEL) {
        return;
      }
      addField(e);
    },
    {
      scopes: ['global'],
      enabled: open,
      enableOnFormTags: true
    }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button className='add-field-dialog-trigger-button' icon={IvyIcons.Plus} aria-label={shortcut} />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <span>{shortcut}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>New Attribute</DialogTitle>
        </DialogHeader>
        <DialogDescription>Choose the name and type of the attribute you want to add.</DialogDescription>
        <Flex ref={enter} tabIndex={-1} direction='column' gap={2}>
          <Flex direction='column' gap={2}>
            <BasicField label='Name' message={nameValidationMessage} aria-label='Name'>
              <Input value={name} onChange={event => setName(event.target.value)} />
            </BasicField>
            <InputFieldWithTypeBrowser value={type} message={typeValidationMessage} onChange={setType} />
          </Flex>
          <DialogFooter>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='primary' size='large' aria-label='Create field' disabled={!allInputsValid()} onClick={addField}>
                    Create Attribute
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Hold {hotkeyText('mod')} to add an additional attribute</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogFooter>
        </Flex>
      </DialogContent>
    </Dialog>
  );
};
