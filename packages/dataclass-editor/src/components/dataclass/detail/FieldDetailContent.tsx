import { BasicCheckbox, BasicField, Flex, Input, Textarea } from '@axonivy/ui-components';
import { useAppContext } from '../../../context/AppContext';
import { removeEmptyStrings } from '../../../utils/array/array';
import type { DataClassField } from '../data/dataclass';
import './DetailContent.css';

export const FieldDetailContent = () => {
  const { dataClass, setDataClass, selectedField } = useAppContext();
  if (selectedField === undefined || dataClass.fields.length - 1 < selectedField) {
    return;
  }

  const field = dataClass.fields[selectedField];

  const handleFieldPropertyChange = <FKey extends keyof DataClassField>(key: FKey, value: DataClassField[FKey]) => {
    const newDataClass = structuredClone(dataClass);
    newDataClass.fields[selectedField][key] = value;
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
      <BasicCheckbox
        label='Persistent'
        checked={field.modifiers.includes('PERSISTENT')}
        onCheckedChange={event => {
          let newModifiers = structuredClone(dataClass.fields[selectedField].modifiers);
          if (event.valueOf()) {
            newModifiers.push('PERSISTENT');
          } else {
            newModifiers = newModifiers.filter(modifier => modifier !== 'PERSISTENT');
          }
          handleFieldPropertyChange('modifiers', newModifiers);
        }}
      />
      <BasicField label='Comment'>
        <Textarea value={field.comment} onChange={event => handleFieldPropertyChange('comment', event.target.value)} />
      </BasicField>
      <BasicField label='Annotations'>
        <Textarea
          value={field.annotations.join('\n')}
          onChange={event => handleFieldPropertyChange('annotations', removeEmptyStrings(event.target.value.split('\n')))}
        />
      </BasicField>
    </Flex>
  );
};
