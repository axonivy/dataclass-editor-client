import { BasicField, BasicInput, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex, Textarea } from '@axonivy/ui-components';
import { useField } from '../../context/FieldContext';
import { isIDType, isVersionType } from '../../data/dataclass';
import { updateModifiers, useFieldProperty } from '../../data/dataclass-hooks';

export const useType = () => {
  const { field, setField } = useField();
  const setType = (type: string) => {
    const newField = structuredClone(field);
    if (!isIDType(type)) {
      newField.modifiers = updateModifiers(false, newField.modifiers, 'ID');
    }
    if (!isVersionType(type)) {
      newField.modifiers = updateModifiers(false, newField.modifiers, 'VERSION');
    }
    newField.type = type;
    setField(newField);
  };
  return { type: field.type, setType };
};

export const FieldNameTypeComment = () => {
  const { field, setProperty } = useFieldProperty();
  const { type, setType } = useType();

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>Name / Type / Comment</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label='Name'>
            <BasicInput value={field.name} onChange={event => setProperty('name', event.target.value)} />
          </BasicField>
          <BasicField label='Type'>
            <BasicInput value={type} onChange={event => setType(event.target.value)} />
          </BasicField>
          <BasicField label='Comment'>
            <Textarea value={field.comment} onChange={event => setProperty('comment', event.target.value)} />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
