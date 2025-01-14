import {
  BasicField,
  Collapsible,
  CollapsibleContent,
  CollapsibleState,
  CollapsibleTrigger,
  type MessageData
} from '@axonivy/ui-components';
import { useField } from '../../context/FieldContext';
import { FieldModifierCheckbox } from './FieldModifierCheckbox';

type FieldPropertiesProps = {
  message: MessageData;
};

export const FieldProperties = ({ message }: FieldPropertiesProps) => {
  const { field } = useField();

  return (
    <Collapsible defaultOpen={field.modifiers.includes('PERSISTENT')}>
      <CollapsibleTrigger state={<CollapsibleState messages={message ? [message] : undefined} />}>Properties</CollapsibleTrigger>
      <CollapsibleContent>
        <BasicField message={message}>
          <FieldModifierCheckbox label='Persistent' modifier='PERSISTENT' />
        </BasicField>
      </CollapsibleContent>
    </Collapsible>
  );
};
