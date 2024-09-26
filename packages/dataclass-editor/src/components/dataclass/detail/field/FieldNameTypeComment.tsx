import { BasicField, BasicInput, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex, Textarea } from '@axonivy/ui-components';
import { useAppContext } from '../../../../context/AppContext';
import { useFieldContext } from '../../../../context/FieldContext';
import { handleFieldPropertyChange, handleFieldTypeChange } from '../../data/dataclass-utils';

export const FieldNameTypeComment = () => {
  const { dataClass, setDataClass } = useAppContext();
  const { field, selectedField } = useFieldContext();

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>Name / Type / Comment</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label='Name'>
            <BasicInput
              value={field.name}
              onChange={event => handleFieldPropertyChange('name', event.target.value, dataClass, setDataClass, selectedField)}
            />
          </BasicField>
          <BasicField label='Type'>
            <BasicInput
              value={field.type}
              onChange={event => handleFieldTypeChange(event.target.value, dataClass, setDataClass, selectedField)}
            />
          </BasicField>
          <BasicField label='Comment'>
            <Textarea
              value={field.comment}
              onChange={event => handleFieldPropertyChange('comment', event.target.value, dataClass, setDataClass, selectedField)}
            />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
