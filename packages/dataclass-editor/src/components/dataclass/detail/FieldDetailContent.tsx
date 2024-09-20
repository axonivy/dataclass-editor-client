import {
  BasicCheckbox,
  BasicField,
  BasicInput,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  Textarea
} from '@axonivy/ui-components';
import { useAppContext } from '../../../context/AppContext';
import { removeEmptyStrings } from '../../../utils/array/array';
import type { DataClassField } from '../data/dataclass';
import './DetailContent.css';

export const FieldDetailContent = () => {
  const { dataClass, setDataClass, selectedField } = useAppContext();
  const field = selectedField !== undefined && selectedField < dataClass.fields.length ? dataClass.fields[selectedField] : undefined;

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
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger>Name / Type / Comment</CollapsibleTrigger>
        <CollapsibleContent>
          <Flex direction='column' gap={4}>
            <BasicField label='Name'>
              <BasicInput value={field.name} onChange={event => handleFieldPropertyChange('name', event.target.value)} />
            </BasicField>
            <BasicField label='Type'>
              <BasicInput value={field.type} onChange={event => handleFieldPropertyChange('type', event.target.value)} />
            </BasicField>
            <BasicField label='Comment'>
              <Textarea value={field.comment} onChange={event => handleFieldPropertyChange('comment', event.target.value)} />
            </BasicField>
          </Flex>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible defaultOpen={false}>
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
      <Collapsible defaultOpen={field.annotations.length !== 0}>
        <CollapsibleTrigger>Annotations</CollapsibleTrigger>
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
