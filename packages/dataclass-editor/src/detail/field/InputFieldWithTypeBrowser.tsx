import { BasicField, BasicInput, Button, Dialog, DialogContent, DialogTrigger, InputGroup, type MessageData } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { Browser } from './browser/Browser';

export type InputFieldProps = {
  value: string;
  onChange: (value: string) => void;
  message?: MessageData;
};

export const InputFieldWithTypeBrowser = ({ value, onChange, message }: InputFieldProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label='Type' style={{ flex: '1' }} message={message} aria-label='Type'>
        <InputGroup>
          <BasicInput value={value} onChange={event => onChange(event.target.value)} />
          <DialogTrigger asChild>
            <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
          </DialogTrigger>
        </InputGroup>
      </BasicField>
      <DialogContent style={{ height: '80vh' }}>
        <Browser onChange={onChange} close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
