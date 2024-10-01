import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@axonivy/ui-components';
import { useField } from '../../context/FieldContext';
import { FieldModifierCheckbox } from './FieldModifierCheckbox';

export const FieldProperties = () => {
  const { field } = useField();

  return (
    <Collapsible defaultOpen={field.modifiers.includes('PERSISTENT')}>
      <CollapsibleTrigger>Properties</CollapsibleTrigger>
      <CollapsibleContent>
        <FieldModifierCheckbox label='Persistent' modifier='PERSISTENT' />
      </CollapsibleContent>
    </Collapsible>
  );
};
