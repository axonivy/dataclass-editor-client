import { BasicField, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex, Input } from '@axonivy/ui-components';
import { useEntityClass } from '../../../context/AppContext';
import type { DataClassEntity } from '@axonivy/dataclass-editor-protocol';

export const useEntityProperty = () => {
  const { entityClass, setEntityClass } = useEntityClass();
  const setProperty = <EKey extends keyof DataClassEntity>(key: EKey, value: DataClassEntity[EKey]) => {
    const newEntityClass = structuredClone(entityClass);
    newEntityClass.entity[key] = value;
    setEntityClass(newEntityClass);
  };
  return setProperty;
};

export const EntityClassDatabaseTable = () => {
  const { entityClass } = useEntityClass();
  const setProperty = useEntityProperty();

  return (
    <Collapsible defaultOpen={entityClass.entity.tableName !== ''}>
      <CollapsibleTrigger>Database Table</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label='Name'>
            <Input value={entityClass.entity.tableName} onChange={event => setProperty('tableName', event.target.value)} />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
