import {
  BasicCheckbox,
  BasicField,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  Input,
  Textarea
} from '@axonivy/ui-components';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { removeEmptyStrings } from '../../../utils/array/array';
import type { DataClassField } from '../data/dataclass';
import './DetailContent.css';

export const FieldDetailContent = () => {
  const { dataClass, setDataClass, selectedField } = useAppContext();
  const field = selectedField !== undefined && selectedField < dataClass.fields.length ? dataClass.fields[selectedField] : undefined;

  const [annotationsOpen, setAnnotationsOpen] = useState(false);
  useEffect(() => setAnnotationsOpen(field ? field.annotations.length !== 0 : false), [field]);

  if (!field) {
    return;
  }

  const handleFieldPropertyChange = <FKey extends keyof DataClassField>(key: FKey, value: DataClassField[FKey]) => {
    const newDataClass = structuredClone(dataClass);
    newDataClass.fields[selectedField!][key] = value;
    setDataClass(newDataClass);
  };

  return (
    <Flex direction='column' gap={4} className='detail-content'>
      <BasicField label='Name'>
        <Input value={field.name} onChange={event => handleFieldPropertyChange('name', event.target.value)} />
      </BasicField>
      <BasicField label='Type'>
        <Input value={field.type} onChange={event => handleFieldPropertyChange('type', event.target.value)} />
      </BasicField>
      <BasicField label='Comment'>
        <Textarea value={field.comment} onChange={event => handleFieldPropertyChange('comment', event.target.value)} />
      </BasicField>
      <Collapsible>
        <CollapsibleTrigger>Properties</CollapsibleTrigger>
        <CollapsibleContent>
          <BasicCheckbox
            label='Persistent'
            checked={field.modifiers.includes('PERSISTENT')}
            onCheckedChange={event => {
              let newModifiers = structuredClone(field.modifiers);
              if (event.valueOf()) {
                newModifiers.push('PERSISTENT');
              } else {
                newModifiers = newModifiers.filter(modifier => modifier !== 'PERSISTENT');
              }
              handleFieldPropertyChange('modifiers', newModifiers);
            }}
          />
        </CollapsibleContent>
      </Collapsible>
      <Collapsible open={annotationsOpen}>
        <CollapsibleTrigger onClick={() => setAnnotationsOpen(!annotationsOpen)}>Annotations</CollapsibleTrigger>
        <CollapsibleContent>
          <Textarea
            value={field.annotations.join('\n')}
            onChange={event => handleFieldPropertyChange('annotations', removeEmptyStrings(event.target.value.split('\n')))}
          />
        </CollapsibleContent>
      </Collapsible>
    </Flex>
  );
};
