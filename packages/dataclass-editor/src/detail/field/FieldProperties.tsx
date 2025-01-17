import { BasicField, Collapsible, CollapsibleContent, CollapsibleState, CollapsibleTrigger } from '@axonivy/ui-components';
import { useField } from '../../context/FieldContext';
import { combineMessagesOfProperties } from '../../data/validation-utils';
import { FieldModifierCheckbox } from './FieldModifierCheckbox';

export const FieldProperties = () => {
  const { field, messages } = useField();

  return (
    <Collapsible defaultOpen={field.modifiers.includes('PERSISTENT')}>
      <CollapsibleTrigger state={<CollapsibleState messages={combineMessagesOfProperties(messages, 'PROPERTIES_GENERAL')} />}>
        Properties
      </CollapsibleTrigger>
      <CollapsibleContent>
        <BasicField message={messages.PROPERTIES_GENERAL}>
          <FieldModifierCheckbox label='Persistent' modifier='PERSISTENT' />
        </BasicField>
      </CollapsibleContent>
    </Collapsible>
  );
};
