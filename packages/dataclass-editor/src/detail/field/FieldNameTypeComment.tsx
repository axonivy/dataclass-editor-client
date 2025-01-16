import { isIDType, isVersionType } from '@axonivy/dataclass-editor-protocol';
import {
  BasicField,
  BasicInput,
  Collapsible,
  CollapsibleContent,
  CollapsibleState,
  CollapsibleTrigger,
  Flex,
  Textarea,
  type MessageData
} from '@axonivy/ui-components';
import { useField } from '../../context/FieldContext';
import { isEntityField, updateCardinality, updateModifiers } from '../../data/dataclass-utils';
import { combineMessagesOfProperties } from '../../data/validation-utils';
import { InputFieldWithTypeBrowser } from './InputFieldWithTypeBrowser';
import { useFieldProperty } from './useFieldProperty';

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
    if (isEntityField(newField)) {
      updateCardinality(newField);
    }
    newField.type = type;
    setField(newField);
  };
  return { type: field.type, setType };
};

type FieldNameTypeCommentProps = {
  messagesByProperty: Record<string, MessageData>;
};

export const FieldNameTypeComment = ({ messagesByProperty }: FieldNameTypeCommentProps) => {
  const { field, setProperty } = useFieldProperty();
  const { type, setType } = useType();

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger state={<CollapsibleState messages={combineMessagesOfProperties(messagesByProperty, 'NAME', 'TYPE')} />}>
        Name / Type / Comment
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label='Name' message={messagesByProperty.NAME}>
            <BasicInput value={field.name} onChange={event => setProperty('name', event.target.value)} />
          </BasicField>
          <InputFieldWithTypeBrowser value={type} onChange={setType} message={messagesByProperty.TYPE} />
          <BasicField label='Comment'>
            <Textarea value={field.comment} onChange={event => setProperty('comment', event.target.value)} />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
