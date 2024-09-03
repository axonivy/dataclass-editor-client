import { BasicCheckbox, BasicField, Flex, Input, Textarea } from '@axonivy/ui-components';
import { useAppContext } from '../../../context/AppContext';
import './DetailContent.css';

export const FieldDetailContent = () => {
  const { dataClass, selectedField } = useAppContext();
  if (selectedField === undefined) {
    return;
  }

  const field = dataClass.fields[selectedField];

  return (
    <Flex direction='column' gap={4} className='detail-content'>
      <BasicField label='Name'>
        <Input value={field.name} />
      </BasicField>
      <BasicField label='Type'>
        <Input value={field.type} />
      </BasicField>
      <BasicCheckbox label='Persistent' checked={field.modifiers.includes('PERSISTENT')} />
      <BasicField label='Comment'>
        <Textarea value={field.comment} />
      </BasicField>
      <BasicField label='Annotations'>
        <Textarea value={field.annotations.join('\n')} />
      </BasicField>
    </Flex>
  );
};
