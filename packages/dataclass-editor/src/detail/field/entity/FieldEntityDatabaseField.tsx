import { BasicField, Collapsible, CollapsibleContent, CollapsibleTrigger, Flex, Input } from '@axonivy/ui-components';
import { useFieldContext } from '../../../context/FieldContext';
import { useDataClassChangeHandlers } from '../../../data/dataclass-change-handlers';
import {
  defaultDatabaseFieldLengthOf,
  fieldTypeCanHaveDatabaseFieldLength,
  isDataClassIDType,
  isDataClassVersionType,
  isEntityField
} from '../../../data/dataclass-utils';
import { FieldModifierCheckbox } from '../FieldModifierCheckbox';

export const FieldEntityDatabaseField = () => {
  const { field } = useFieldContext();
  const { handleFieldEntityPropertyChange } = useDataClassChangeHandlers();
  if (!isEntityField(field)) {
    return;
  }

  const mappedByFieldNameIsSet = field.entity.mappedByFieldName !== '';
  const canHaveDatabaseFieldLength = fieldTypeCanHaveDatabaseFieldLength(field.type);

  const modifersContainID = field.modifiers.includes('ID');
  const modifiersContainVersion = field.modifiers.includes('VERSION');
  const modifiersContainIDOrVersion = modifersContainID || modifiersContainVersion;

  return (
    <Collapsible
      defaultOpen={
        (!mappedByFieldNameIsSet && field.entity.databaseName !== '') ||
        (canHaveDatabaseFieldLength && field.entity.databaseFieldLength !== '') ||
        field.modifiers.some(modifier => modifier !== 'PERSISTENT')
      }
    >
      <CollapsibleTrigger>Database Field</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <BasicField label='Name'>
            <Input
              value={mappedByFieldNameIsSet ? '' : field.entity.databaseName}
              onChange={event => handleFieldEntityPropertyChange('databaseName', event.target.value)}
              placeholder={mappedByFieldNameIsSet ? '' : field.name}
              disabled={mappedByFieldNameIsSet}
            />
          </BasicField>
          <BasicField label='Length'>
            <Input
              value={canHaveDatabaseFieldLength ? field.entity.databaseFieldLength : ''}
              onChange={event => handleFieldEntityPropertyChange('databaseFieldLength', event.target.value)}
              placeholder={defaultDatabaseFieldLengthOf(field.type)}
              disabled={!canHaveDatabaseFieldLength}
            />
          </BasicField>
          <BasicField label='Properties'>
            <FieldModifierCheckbox
              label='ID'
              modifier='ID'
              disabled={modifiersContainVersion || !isDataClassIDType(field.type) || mappedByFieldNameIsSet}
            />
            <FieldModifierCheckbox label='Generated' modifier='GENERATED' disabled={!modifersContainID || mappedByFieldNameIsSet} />
            <FieldModifierCheckbox
              label='Not nullable'
              modifier='NOT_NULLABLE'
              disabled={modifiersContainIDOrVersion || mappedByFieldNameIsSet}
            />
            <FieldModifierCheckbox label='Unique' modifier='UNIQUE' disabled={modifiersContainIDOrVersion || mappedByFieldNameIsSet} />
            <FieldModifierCheckbox
              label='Not updateable'
              modifier='NOT_UPDATEABLE'
              disabled={modifiersContainIDOrVersion || mappedByFieldNameIsSet}
            />
            <FieldModifierCheckbox
              label='Not insertable'
              modifier='NOT_INSERTABLE'
              disabled={modifiersContainIDOrVersion || mappedByFieldNameIsSet}
            />
            <FieldModifierCheckbox
              label='Version'
              modifier='VERSION'
              disabled={modifersContainID || !isDataClassVersionType(field.type) || mappedByFieldNameIsSet}
            />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
