import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@axonivy/ui-components';
import { useFieldContext } from '../../context/FieldContext';
import { FieldModifierCheckbox } from './FieldModifierCheckbox';

export const FieldProperties = () => {
  const { field } = useFieldContext();

  return (
    <Collapsible defaultOpen={field.modifiers.includes('PERSISTENT')}>
      <CollapsibleTrigger>Properties</CollapsibleTrigger>
      <CollapsibleContent>
        <FieldModifierCheckbox label='Persistent' modifier='PERSISTENT' />
      </CollapsibleContent>
    </Collapsible>
  );
};
