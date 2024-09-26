import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@axonivy/ui-components';
import { FieldModifierCheckbox } from './FieldModifierCheckbox';

export const FieldProperties = () => (
  <Collapsible defaultOpen={false}>
    <CollapsibleTrigger>Properties</CollapsibleTrigger>
    <CollapsibleContent>
      <FieldModifierCheckbox label='Persistent' modifier='PERSISTENT' />
    </CollapsibleContent>
  </Collapsible>
);
