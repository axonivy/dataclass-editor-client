import { BasicField, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex, Input } from '@axonivy/ui-components';
import { useAppContext } from '../../../../../context/AppContext';
import { useDataClassChangeHandlers } from '../../../data/dataclass-change-handlers';
import { isEntity } from '../../../data/dataclass-utils';

export const EntityClassDatabaseTable = () => {
  const { dataClass } = useAppContext();
  const { handleDataClassEntityPropertyChange } = useDataClassChangeHandlers();
  if (!isEntity(dataClass)) {
    return;
  }

  return (
    <Collapsible defaultOpen={dataClass.entity.tableName !== ''}>
      <CollapsibleTrigger>Database Table</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label='Name'>
            <Input
              value={dataClass.entity.tableName}
              onChange={event => handleDataClassEntityPropertyChange('tableName', event.target.value)}
            />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
