import { BasicField, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex, Input, Textarea } from '@axonivy/ui-components';
import { useDataClassProperty } from './useDataClassProperty';

export const DataClassNameDescription = () => {
  const { dataClass, setProperty } = useDataClassProperty();

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>Name / Description</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label='Name'>
            <Input value={`${dataClass.namespace}.${dataClass.simpleName}`} disabled={true} />
          </BasicField>
          <BasicField label='Description'>
            <Textarea value={dataClass.comment} onChange={event => setProperty('comment', event.target.value)} />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
