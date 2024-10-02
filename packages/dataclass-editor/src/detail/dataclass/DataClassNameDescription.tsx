import { BasicField, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex, Input, Textarea } from '@axonivy/ui-components';
import { useAppContext } from '../../context/AppContext';
import { useDataClassProperty } from '../../data/dataclass-hooks';

export const DataClassNameDescription = () => {
  const { dataClass } = useAppContext();
  const setProperty = useDataClassProperty();

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>Name / Description</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label='Name'>
            <Input value={dataClass.simpleName} disabled={true} />
          </BasicField>
          <BasicField label='Description'>
            <Textarea value={dataClass.comment} onChange={event => setProperty('comment', event.target.value)} />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
