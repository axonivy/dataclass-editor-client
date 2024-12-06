import { isIDType, isVersionType } from '@axonivy/dataclass-editor-protocol';
import { BasicField, BasicInput, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex, Textarea } from '@axonivy/ui-components';
import { useField } from '../../context/FieldContext';
import { updateModifiers } from '../../data/dataclass-utils';
import { useCardinality } from './entity/FieldEntityAssociation';
import { isEntityField } from './FieldDetailContent';
import { InputFieldWithTypeBrowser } from './InputFieldWithTypeBrowser';
import { useFieldProperty } from './useFieldProperty';

export const useType = () => {
  const { field, setField } = useField();
  const { setCardinality } = useCardinality();
  const setType = (type: string) => {
    const newField = structuredClone(field);
    if (!isIDType(type)) {
      newField.modifiers = updateModifiers(false, newField.modifiers, 'ID');
    }
    if (!isVersionType(type)) {
      newField.modifiers = updateModifiers(false, newField.modifiers, 'VERSION');
    }
    if (isEntityField(field)) {
      setCardinality();
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
          <InputFieldWithTypeBrowser value={type} onChange={setType} />
          <BasicField label='Comment'>
            <Textarea value={field.comment} onChange={event => setProperty('comment', event.target.value)} />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
