import { BasicField, BasicInput, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { useEntityClass } from '../../../context/AppContext';
import type { EntityClass } from '@axonivy/dataclass-editor-protocol';

export const useEntityProperty = () => {
  const { entityClass, setEntityClass } = useEntityClass();
  const setProperty = <EKey extends keyof EntityClass>(key: EKey, value: EntityClass[EKey]) => {
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
            <BasicInput value={entityClass.entity.tableName} onChange={event => setProperty('tableName', event.target.value)} />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
