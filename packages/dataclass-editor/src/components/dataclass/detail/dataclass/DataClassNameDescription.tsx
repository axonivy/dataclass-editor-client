import { BasicField, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex, Input, Textarea } from '@axonivy/ui-components';
import { useAppContext } from '../../../../context/AppContext';
import { handleDataClassPropertyChange } from '../../data/dataclass-utils';

export const DataClassNameDescription = () => {
  const { dataClass, setDataClass } = useAppContext();

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>Name / Description</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label='Name'>
            <Input value={dataClass.simpleName} disabled={true} />
          </BasicField>
          <BasicField label='Description'>
            <Textarea
              value={dataClass.comment}
              onChange={event => handleDataClassPropertyChange('comment', event.target.value, dataClass, setDataClass)}
            />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
