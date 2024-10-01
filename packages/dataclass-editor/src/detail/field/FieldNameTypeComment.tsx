import { BasicField, BasicInput, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex, Textarea } from '@axonivy/ui-components';
import { useFieldContext } from '../../context/FieldContext';
import { useDataClassChangeHandlers } from '../../data/dataclass-change-handlers';

export const FieldNameTypeComment = () => {
  const { field } = useFieldContext();
  const { handleFieldPropertyChange, handleFieldTypeChange } = useDataClassChangeHandlers();

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>Name / Type / Comment</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label='Name'>
            <BasicInput value={field.name} onChange={event => handleFieldPropertyChange('name', event.target.value)} />
          </BasicField>
          <BasicField label='Type'>
            <BasicInput value={field.type} onChange={event => handleFieldTypeChange(event.target.value)} />
          </BasicField>
          <BasicField label='Comment'>
            <Textarea value={field.comment} onChange={event => handleFieldPropertyChange('comment', event.target.value)} />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
