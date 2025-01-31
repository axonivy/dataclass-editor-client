import {
  BasicField,
  Collapsible,
  CollapsibleContent,
  CollapsibleState,
  CollapsibleTrigger,
  Flex,
  Input,
  Textarea
} from '@axonivy/ui-components';
import { useDetail } from '../../context/DetailContext';
import { combineMessagesOfProperties } from '../../data/validation-utils';
import { useDataClassProperty } from './useDataClassProperty';

export const DataClassNameDescription = () => {
  const { messages } = useDetail();
  const { dataClass, setProperty } = useDataClassProperty();

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger state={<CollapsibleState messages={combineMessagesOfProperties(messages, 'NAMESPACE')} />}>
        Name / Description
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label='Name' message={messages.NAMESPACE}>
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
